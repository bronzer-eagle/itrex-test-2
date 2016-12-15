require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {}

    getMessages(user, filters, pagination, callback) {
        let query, count, searchByName, populateConf,
            sortByDate      = {},
            fields          = {sender: 1, receivers: 1, text: 1, subject: 1, attachment: 1},
            options         = {
                limit       : pagination.start + pagination.count,
                skip        : pagination.start
            };

        if (filters.sortByDate) {
            sortByDate.sort = {'date': filters.sortByDate.toLowerCase()};
        }

        switch (filters.messageType) {
            case 'received':
                query   = {receivers: {$elemMatch: {$eq: user.email}}};
                break;
            case 'sent':
                query   = {sender: user._id};
                break;
            case 'blacklisted':
                query   = {};
                break;
            case 'all':
            default:
                query   = {$or : [{receivers: {$elemMatch: {$eq: user.email}}}, {sender: user._id}]};
                break;
        }

        count           = Message.find(query);
        searchByName    = filters.searchByName ? {name: {$regex : `.*${filters.searchByName}.*`}} : {};
        populateConf    = {
            path: 'sender',
            match: searchByName,
            select: '_id name email',
            options: options
        };

        Message
            .find(query, fields, sortByDate)
            .populate(populateConf)
            .exec((err, messages) => {
                if (err) {
                    callback({
                        error: err
                    });
                    return;
                }

                if (!messages) {
                    callback(null);
                    return;
                }

                messages = _.filter(messages, (item) => {return item.sender}); //TODO: find problem with query in populate

                if (filters.sortByName) {
                    messages = _.sortBy(messages, item => { return item.sender.name});

                    if (filters.sortByName == 'DESC') {
                        messages = messages.reverse();
                    }
                }

                pagination = this.paginate(pagination, count);

                let result = {
                    pagination,
                    messages
                };

                callback(result);
            })
    }

    paginate(pagination, count) {
        pagination.start = pagination.start + pagination.count;
        pagination.moreAvailable  = pagination.start < count;

        return pagination;
    }
}

module.exports = new DataController();