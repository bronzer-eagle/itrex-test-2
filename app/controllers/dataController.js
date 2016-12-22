require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {}

    getMessages(user, filters, pagination, callback) { //TODO: refactor this!!!
        let query, count, searchByName,
            sortByDate      = {},
            fields          = {sender: 1, receivers: 1, text: 1, subject: 1, attachment: 1},
            options         = {
                limit       : pagination.start + pagination.count,
                skip        : pagination.start
            },
            populateSenderConf    = {
                path        : 'sender',
                select      : '_id name email'
            },
            populateReceiverConf    = {
                path        : 'receivers.receiver',
                select      : '_id name email'
            },
            callbackMessage = (error, messages) => {
                console.log(messages);
                if (error)     { callback({error}); return; }

                if (!messages) { callback(null);    return; }

                if (filters.searchByName){
                    messages    = _.filter(messages, (item) => {return item.sender});
                    messages    = _.filter(messages, (item) => {return item.receivers[0].receiver});
                }

                if (filters.sortByName) {
                    messages    = _.sortBy(messages, item => {
                        return item.sender.name.toLowerCase()
                    });

                    messages    = (filters.sortByName == 'DESC') ? messages.reverse() : messages;
                }

                pagination      = this.paginate(pagination, count);

                let result      = {
                    pagination,
                    messages
                };

                callback(result);
            };

        if (!filters.searchByName) {
            sortByDate.sort = options.sort = (filters.sortByDate) ? {'date': filters.sortByDate.toLowerCase()} : {};

            switch (filters.messageType) {
                case 'received':
                    query   = {receivers: {$elemMatch: {receiver: user._id}}};
                    break;
                case 'sent':
                    query   = {sender: user._id};
                    break;
                case 'blacklisted':
                case 'all':
                default:
                    query   = {$or : [{receivers: {$elemMatch: {receiver: user._id}}}, {sender: user._id}]};
                    break;
            }

            count           = Message.count(query);

            Message.find(query, fields, options)
                .populate(populateSenderConf)
                .populate(populateReceiverConf)
                .exec(callbackMessage)

        } else {
            switch (filters.messageType) {
                case 'received':
                    query                       = {receivers: {$elemMatch: {receiver: user._id}}};
                    populateSenderConf.match    = {name: {$regex : `.*${filters.searchByName}.*`, $options: `i`}};
                    populateSenderConf.options  = options;
                    break;
                case 'sent':
                    query                           = {sender: user._id};
                    populateReceiverConf.match      = {name: {$regex : `.*${filters.searchByName}.*`, $options: `i`}};
                    populateReceiverConf.options    = options;
                    break;
                case 'blacklisted':
                case 'all':
                default:
                    populateSenderConf.match        = {name: {$regex : `.*${filters.searchByName}.*`, $options: `i`}}; //Set or
                    populateReceiverConf.match      = {name: {$regex : `.*${filters.searchByName}.*`, $options: `i`}};
                    populateReceiverConf.options    = options;
                    break;
            }

            if (query) {
                count                       = Message.count(query);

                Message
                    .find(query, fields, sortByDate)
                    .populate(populateSenderConf)
                    .populate(populateReceiverConf)
                    .exec(callbackMessage);

            } else {

                Message
                    .find({receivers: {$elemMatch: {receiver: user._id}}}, fields, sortByDate)
                    .populate(populateSenderConf)
                    .populate({
                        path        : 'receivers.receiver',
                        select      : '_id name email'
                    })
                    .then(messagesFirstList => {
                        Message
                            .find({sender: user._id}, fields, sortByDate)
                            .populate(populateReceiverConf)
                            .populate({
                                path        : 'sender',
                                select      : '_id name email'
                            })
                            .exec((err, messagesSecondList) => {
                                messagesSecondList.push(...messagesFirstList);
                                callbackMessage(err, messagesSecondList);
                            })
                    })

            }
        }
    }

    findMessage(id, callback) {
        Message.findById(id, (err, message) => {
            if (err) {
                callback(err, null);
                return;
            }

            if (message) {
                callback(null, message);
            }
        })
    }

    paginate(pagination, count) {
        pagination.start = pagination.start + pagination.count;
        pagination.moreAvailable  = pagination.start < count;

        return pagination;
    }
}

module.exports = new DataController();