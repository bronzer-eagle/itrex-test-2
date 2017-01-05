require('../database/database');

let async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User'),
    nodemailer      = require('nodemailer'),
    dataController  = require('./dataController'),
    userController  = require('./userController');

class HomeController {
    constructor() {}

    sendData(req, res) {
        let user    = req.user;
        let fields = {name : 1, email : 1, admin : 1, blacklist: 1};

        User.findOne({_id: user._id}, fields, (err, user) => {
            if (err) {
                res.status(500);
                res.json(err);
            }

            if (user) {

                User.find({_id: {$ne : user._id}}, {name : 1, email : 1, admin: 1}, (err, usersList) => {
                    res.status(200);
                    res.json({
                        user,
                        usersList
                    });
                });
            } else {
                res.status(404);
                res.json({ err: 'No such a user' });
            }
        });
    }

    getMessages(req, res) {
        let pagination          = JSON.parse(req.query.pagination);
        let filters             = JSON.parse(req.query.options);

        if (pagination) {
            User.findById(req.user._id, (err, user) => {
                if (user) {
                    dataController.getMessages(user, filters, pagination, (result) => {
                        if (result.err) {
                            res.status(500);
                            res.json(result);
                        } else {
                            res.status(200);
                            res.json(result);
                        }
                    })
                }
            })
        } else {
            res.status(404);
            res.json({
                'error': 'No pagination!'
            })
        }
    }

    readMessage(req, res) {
        let messageId = req.query.message_id;

        dataController.findMessage(messageId, (err, message) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                message.readMessage(req.user._id);
                res.status(200);
                res.json({});
            }
        })
    }
}

module.exports = new HomeController();
