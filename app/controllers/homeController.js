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
                    res.error(404, { err: 'No such a user' });
                    return;
                }

                return User.find({_id: {$ne : user._id}}, {name : 1, email : 1, admin: 1})
                    .then(usersList => {
                        res.success(200, {user, usersList});
                    });
            }, err => {
                res.error(500, err);
            });
    }

    getMessages(req, res) {
        let
            pagination  = req.query.pagination,
            filters     = JSON.parse(req.query.options);

        User.findById(req.user._id)
            .then(user => {
                if (!user) res.error(403, {});

                return dataController.getMessages(user, filters, pagination)
                    .then((result) => {
                    res.success(200, result);
                    })
            }, err => {
                res.error(500, err);
            })
    }

    readMessage(req, res) {
        dataController
            .findMessage(req.query.message_id)
            .then(message => {
                message.readMessage(req.user._id);
                res.success(204, {})
            }, err => {
                res.error(500, err);
            })
    }
}

module.exports = new HomeController();