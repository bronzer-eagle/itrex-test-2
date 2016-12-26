require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {}

    getMessages(user, filters, pagination, callback) { //TODO: refactor this!!!
        let
            query, count, searchByName,
            sortByDate      = {},
            fields          = {sender: 1, receivers: 1, text: 1, subject: 1, attachment: 1},  //fields to return from db
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
                if (error)     { callback({error}); return; }
                if (!messages) { callback(null);    return; }

                if (filters.searchByName) {
                    messages    = _.filter(messages, item => item.sender);
                    messages    = _.filter(messages, item => item.receivers[0].receiver);
                }

                if (filters.sortByName) {
                    messages    = _.sortBy(messages, item => item.sender.name.toLowerCase());
                    messages    = (filters.sortByName == 'DESC') ? messages.reverse() : messages;
                }

                if (user.admin && user.watchAsMe.length) {
                    messages    = _.map(messages, message => {
                        if (user.watchAsMe.includes(message.sender._id)) {
                            //message.
                        }
                    })
                }

                pagination      = this.paginate(pagination, count);

                callback({pagination, messages});
            };

        let
            receiverUser        = {receiver: user._id},
            senderUser          = {sender: user._id},
            notInBlackList      = {$nin: user.blacklist},
            inBlackList         = {$in: user.blacklist},
            receiverInWatchAsMe = {receiver: {$in: user.watchAsMe}},
            senderInWatchAsMe   = {sender: {$in: user.watchAsMe}},
            receivers           = {$elemMatch: {$or: [receiverUser, receiverInWatchAsMe]}},
            received            = {receivers: receivers, sender: notInBlackList},
            sent                = {$or: [senderUser, senderInWatchAsMe]},
            all                 = {$or : [received, senderUser, senderInWatchAsMe]};

        sortByDate.sort = options.sort = (filters.sortByDate) ? {'date': filters.sortByDate.toLowerCase()} : {};

        switch (filters.messageType) {
            case 'received':
                query   = received;
                break;
            case 'sent':
                query   = sent;
                break;
            case 'blacklisted':
                query   = {sender: inBlackList, receivers: receivers}; //TODO: set "sender : inWatchAsMeUserBlacklist"
                break;
            case 'all':
            default:
                query   = all;
                break;
        }

        if (!filters.searchByName) {

            count       = Message.count(query);

            Message.find(query, fields, options)
                .populate(populateSenderConf)
                .populate(populateReceiverConf)
                .exec(callbackMessage)

        } else {

            let
                findByNameRegExp = {name: {$regex : `.*${filters.searchByName}.*`, $options: `i`}};

            switch (filters.messageType) {
                case 'received':
                    populateSenderConf.match        = findByNameRegExp;
                    populateSenderConf.options      = options;
                    break;
                case 'sent':
                    populateReceiverConf.match      = findByNameRegExp;
                    populateReceiverConf.options    = options;
                    break;
                case 'blacklisted':
                    populateSenderConf.match        = findByNameRegExp;
                    populateSenderConf.options      = options;
                    break;
                case 'all':
                default:
                    query                           = null;
                    populateSenderConf.match        = findByNameRegExp;
                    populateReceiverConf.match      = findByNameRegExp;
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
                    .find(all, fields, sortByDate)
                    .populate(populateSenderConf)             //matching by sender population
                    .populate({
                        path        : 'receivers.receiver',
                        select      : '_id name email'
                    })
                    .then(messagesFirstList => {
                        Message
                            .find(senderUser, fields, sortByDate)
                            .populate(populateReceiverConf)   //matching by receiver population
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

    paginate (pagination, count) {
        pagination.start = pagination.start + pagination.count;
        pagination.moreAvailable  = pagination.start < count;

        return pagination;
    }
}

module.exports = new DataController();