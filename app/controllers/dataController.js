require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {
        this.messageFields          = {sender: 1, receivers: 1, text: 1, subject: 1, attachment: 1, date: 1};
    }

    getMessages(user, filters, pagination, callback) { //TODO: refactor this!!!
        let
            query, searchByName, findByNameRegExp,
            options         = {
                limit       : pagination.count,
                skip        : pagination.start
            },
            populateSenderConf    = {
                path        : 'sender',
                select      : '_id name email',
                options     : {}
            },
            populateReceiverConf    = {
                path        : 'receivers.receiver',
                select      : '_id name email',
                options     : {}
            },

            /**
             *  QUERIES TO DB
             */

            receiverUser        = {receiver: user._id},
            senderUser          = {sender: user._id},
            notInBlackList      = {$nin: user.blacklist},
            inBlackList         = {$in: user.blacklist},
            receivers           = {$elemMatch: receiverUser},
            received            = {receivers: receivers, sender: notInBlackList},
            blacklist           = {sender: inBlackList, receivers: receivers},
            all                 = {$or : [received, senderUser]},

            /**
             * CALLBACK FUNCTION AFTER GETTING MESSAGES FROM DB
             * @param error
             * @param messages
             * @param count
             */

            callbackMessage = (error, messages, count) => {
                if (error)     { callback({error}); return; }
                if (!messages) { callback(null);    return; }

                if (filters.searchByName) {
                    messages    = _.filter(messages, item => item.sender && item.receivers[0].receiver);

                    count       = messages.length;

                    messages    = messages.splice(pagination.start, pagination.count);
                }

                if (filters.sortByName) {
                    messages    = _.sortBy(messages, item => item.sender.name.toLowerCase());
                    messages    = (filters.sortByName == 'DESC') ? messages.reverse() : messages;
                }

                pagination      = this.paginate(pagination, count);

                callback({pagination, messages});
            };

        options.sort = (filters.sortByDate) ? {'date': filters.sortByDate.toLowerCase()} : {};

        switch (filters.messageType) {
            case 'received':
                query   = received;
                break;
            case 'sent':
                query   = senderUser;
                break;
            case 'blacklisted':
                query   = blacklist;
                break;
            case 'all':
            default:
                query   = all;
                break;
        }

        Message.count(query, (err, count) => {
            if (filters.searchByName) {
                findByNameRegExp = {name: {$regex: `.*${filters.searchByName}.*`, $options: `i`}};

                switch (filters.messageType) {
                    case 'received':
                        populateSenderConf.match        = findByNameRegExp;
                        break;
                    case 'sent':
                        populateReceiverConf.match      = findByNameRegExp;
                        break;
                    case 'blacklisted':
                        populateSenderConf.match        = findByNameRegExp;
                        break;
                    case 'all':
                    default:
                        query                           = null;
                        populateSenderConf.match        = findByNameRegExp;
                        populateReceiverConf.match      = findByNameRegExp;
                        break;
                }

                delete options.limit;
                delete options.skip;
            }

            if (query) {
                Message
                    .find(query, this.messageFields, options)
                    .populate(populateSenderConf)
                    .populate(populateReceiverConf)
                    .exec((err, messages)=>{
                        callbackMessage(err, messages, count);
                    });
            } else {
                Message
                    .find(all, this.messageFields, options)
                    .populate(populateSenderConf)             //matching by sender population
                    .populate({
                        path        : 'receivers.receiver',
                        select      : '_id name email'
                    })
                    .then(messagesFirstList => {
                        Message
                            .find(senderUser, this.messageFields, options)
                            .populate(populateReceiverConf)   //matching by receiver population
                            .populate({
                                path        : 'sender',
                                select      : '_id name email'
                            })
                            .exec((err, messagesSecondList) => {
                                messagesSecondList.push(...messagesFirstList);
                                callbackMessage(err, messagesSecondList, count);
                            })
                    })
            }
        });
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