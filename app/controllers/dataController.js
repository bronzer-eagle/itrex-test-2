require('../database/database');

let _               = require('underscore'),
    async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User');

class DataController {
    constructor() {

    }

    getSentMessages(user, pagination, callback) {
        Message.find({sender     : user._id}, (err, messages) => {
            let result = this.paginate(pagination, messages);

            callback(result)
        })
    }

    paginate(pagination, arr) {
        if (arr.length) {
            let end = pagination.start + pagination.count;

            if (end >= arr.length) {
                end = arr.length;
                pagination.moreAvailable = false
            }

            arr              = arr.slice(pagination.start, end);

            pagination.start = end;

            return {
                pagination,
                arr
            }
        } else {
            pagination.moreAvailable = false;
            return {
                pagination,
                arr: []
            }
        }
    }
}

module.exports = new DataController();