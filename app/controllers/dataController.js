require('../database/database');

let
    _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    Promise         = require("bluebird"),
    User            = mongoose.model('User');

Promise.promisifyAll(mongoose);

class DataController {
    constructor() {}

    //TODO: set to promise
    
    getMessages(user, filters, pagination) {
        let
            query, searchByName, findByNameRegExp,
            options         = {
                limit       : pagination.count,
                skip        : pagination.start,
                sort        : {}
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
            queries         = DataController.getQuery(user),
            messageFields   = DataController.getMessageFields();

        options.sort.date  = filters.sortByDate.toLowerCase() || 'desc';

        if (filters.sortByName) {
            options.sort.senderName = filters.sortByName.toLowerCase();

            delete options.sort.date;
        }

        query = queries[filters.messageType] || queries['default'];

        return Message.count(query)
            .then((count) => {
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
                    return Message
                        .find(query, messageFields, options)
                        .populate(populateSenderConf)
                        .populate(populateReceiverConf)
                        .then((messages) => DataController.processMessages(messages, count, pagination))
                } else {
                    return Message
                        .find(queries['all'], messageFields, options)
                        .populate(populateSenderConf)             //matching by sender population
                        .populate({
                            path        : 'receivers.receiver',
                            select      : '_id name email'
                        })
                        .then(messagesFirstList => {
                            return Message
                                .find(queries['sent'], messageFields, options)
                                .populate(populateReceiverConf)   //matching by receiver population
                                .populate({
                                    path        : 'sender',
                                    select      : '_id name email'
                                })
                                .then((messagesSecondList) => {
                                    messagesSecondList.push(...messagesFirstList);
                                    return DataController.processMessagesWithFilters(messagesSecondList, count, pagination);
                                })
                        })
                }
        });
    }
    
    //TODO: set to promise

    findMessage(id) {
        Message.findById(id).then(message => message, err => err)
    }

    /**
     *  STATIC METHODS
     */

    static processMessages (messages, count, pagination) {
        if (!messages) return null;

        pagination = DataController.paginate(pagination, count);

        return {pagination, messages};
    };

    static processMessagesWithFilters (messages, count, pagination) {
        if (!messages) return null;

        messages    = _.filter(messages, item => item.sender && item.receivers[0].receiver);
        count       = messages.length;
        messages    = messages.splice(pagination.start, pagination.count);
        pagination  = DataController.paginate(pagination, count);

        console.log(messages);

        return {pagination, messages};
    };

    static getMessageFields() {
        return {sender: 1, receivers: 1, text: 1, subject: 1, attachment: 1, date: 1};
    }

    static setQueries(user) {
        let
            receiverUser        = {receiver: user._id},
            senderUser          = {sender: user._id},
            notInBlackList      = {$nin: user.blacklist},
            inBlackList         = {$in: user.blacklist},
            receivers           = {$elemMatch: receiverUser},
            received            = {receivers: receivers, sender: notInBlackList},
            blacklist           = {sender: inBlackList, receivers: receivers},
            all                 = {$or : [received, senderUser]};

        return {senderUser, received, blacklist, all};
    }

    static getQuery(user) {
        let {senderUser, received, blacklist, all} = DataController.setQueries(user);

        return {
            'received'      : received,
            'sent'          : senderUser,
            'blacklisted'   : blacklist,
            'all'           : all,
            'default'       : all
        };
    }

    static paginate (pagination, count) {
        pagination.start            = pagination.start + pagination.count;
        pagination.moreAvailable    = pagination.start < count;

        return pagination;
    }
}

module.exports = new DataController();