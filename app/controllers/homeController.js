require('../database/database');

let
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User'),
    dataController  = require('./dataController');

class HomeController {
    constructor() {}

    sendData(req, res) {
        let
            user    = req.user,
            fields  = {name : 1, email : 1, admin : 1, blacklist: 1};

        User.findOne({_id: user._id}, fields)
            .then(user => {
                if (!user) {
                    helper.error(404, { err: 'No such a user' }, res);
                    return;
                }

                return User.find({_id: {$ne : user._id}}, {name : 1, email : 1, admin: 1})
                    .then(usersList => {
                        helper.success(200, {user, usersList}, res);
                    });
            }, err => {
                helper.error(500, err, res);
            });
    }

    getMessages(req, res) {
        let
            pagination  = JSON.parse(req.query.pagination),
            filters     = JSON.parse(req.query.options);

        if (pagination) {
            User.findById(req.user._id)
                .then(user => {
                    if (!user) helper.error(403, {}, res);

                    return dataController.getMessages(user, filters, pagination)
                        .then((result) => {
                            res.status(200);
                            res.json(result);
                        })
                }, err => {
                    helper.error(500, err, res);
                })
        } else {
            helper.error(404, {'error': 'No pagination!'}, res)
        }
    }

    readMessage(req, res) {
        dataController
            .findMessage(req.query.message_id)
            .then(message => {
                message.readMessage(req.user._id);
                helper.success(204, {}, res)
            }, err => {
                helper.error(500, err, res);
            })
    }
}

module.exports = new HomeController();