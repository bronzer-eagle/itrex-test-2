require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {

    }

    getReceivedMessages(user, pagination, callback) {
        let options ={
            limit: pagination.start + pagination.count,
            skip: pagination.start
        };

        let query = {receivers: {$elemMatch: user.email}};

        let count = Message.find(query);

        Message.find(query, options, (err, messages) => {
            pagination = this.paginate(pagination, count);

            let result = {
                pagination,
                messages
            };

            callback(result)
        })
    }

    getSentMessages(user, pagination, callback) {
        let options ={
            limit: pagination.start + pagination.count,
            skip: pagination.start
        };

        let query = {sender: user._id};

        let count = Message.find(query);

        Message.find(query, options, (err, messages) => {
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