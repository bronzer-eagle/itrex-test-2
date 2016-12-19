require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {}

    getMessages(user, filters, pagination, callback) {
        let query, count, searchByName,
            sortByDate      = {},
            fields          = {sender: 1, receivers: 1, text: 1, subject: 1, attachment: 1},
            options         = {
                limit       : pagination.start + pagination.count,
                skip        : pagination.start
            },
            populateConf    = {
                path        : 'sender',
                select      : '_id name email'
            },
            callbackMessage = (error, messages) => {
                if (error)     { callback({error}); return; }

                if (!messages) { callback(null);    return; }

                if (filters.searchByName){
                    messages    = _.filter(messages, (item) => {return item.sender});
                }

                if (filters.sortByName) {
                    messages    = _.sortBy(messages, item => { return item.sender.name});

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
                    query   = {receivers: {$elemMatch: {email: user.email}}};
                    break;
                case 'sent':
                    query   = {sender: user._id};
                    break;
                case 'blacklisted':
                case 'all':
                default:
                    query   = {$or : [{receivers: {$elemMatch: {email: user.email}}}, {sender: user._id}]};
                    break;
            }

            count           = Message.count(query);

            Message.find(query, fields, options).populate(populateConf).exec(callbackMessage)

        } else {
            switch (filters.messageType) {
                case 'received':
                    query               = {receivers: {$elemMatch: {email: user.email}}};
                    populateConf.match  = {name: {$regex : `.*${filters.searchByName}.*`}};
                    break;
                case 'sent':
                    query               = {sender: user._id, receivers: {$elemMatch: {name: {$regex : `.*${filters.searchByName}.*`}}}};
                    break;
                case 'blacklisted':
                case 'all':
                default:
                    query               = {$or : [{receivers: {$elemMatch: {email: user.email}}}, {sender: user._id, receivers: {$elemMatch: {name: {$regex : `.*${filters.searchByName}.*`}}}}]};
                    populateConf.match  = {name: {$regex : `.*${filters.searchByName}.*`}};
                    break;
            }

            count                       = Message.count(query);
            populateConf.options        = options;

            Message.find(query, fields, sortByDate).populate(populateConf).exec(callbackMessage)
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