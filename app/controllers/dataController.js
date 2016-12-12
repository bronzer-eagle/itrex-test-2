require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {

    }

    getMessages(user, pagination, type, callback) {
        let options ={
            limit: pagination.start + pagination.count,
            skip: pagination.start
        };

        let fields = {sender: 1, receivers: 1, text: 1, subject: 1};

        let query = (type == 'received') ? {receivers: {$elemMatch: {$eq: user.email}}} : {sender: user.email};

        let count = Message.find(query);

        Message.find(query, fields, options, (err, messages) => {
            pagination = this.paginate(pagination, count);

            let result = {
                pagination,
                messages
            };

            callback(result)
        })
    }

    getMessagesByName(user, searchEmail, pagination, callback) {
        let options ={
            limit: pagination.start + pagination.count,
            skip: pagination.start
        };

        let fields = {sender: 1, receivers: 1, text: 1, subject: 1};

        let query = {
            $or:[{sender: user.email, receivers: {$elemMatch: {$eq: searchEmail}}},
                {receivers: {$elemMatch: {$eq: user.email}}, sender: searchEmail}]
        };

        let count = Message.find(query);

        Message.find(query, fields, options, (err, messages) => {
            pagination = this.paginate(pagination, count);

            let result = {
                pagination,
                messages
            };

            callback(result)
        })
    }

    paginate(pagination, count) {
        pagination.start = pagination.start + pagination.count;
        pagination.moreAvailable  = pagination.start < count;

        return pagination;
    }
}

module.exports = new DataController();