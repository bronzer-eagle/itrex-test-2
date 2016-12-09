require('../database/database');

let async           = require('async'),
    mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User'),
    nodemailer      = require('nodemailer'),
    dataController  = require('./dataController'),
    userController  = require('./userController');

class HomeController {
    constructor() {

    }

    sendData(req, res) {
        let user = req.user;

        User.findOne({_id: user._id}, (err, user) => {
            if (user) {
                User.find({_id: {$ne : user._id}}, (err, usersList) => {
                    user        = userController.createUserData(user);
                    usersList   = userController.createUserData(usersList);

                    res.status(200);
                    res.json({
                        user,
                        usersList
                    });
                });
            } else {
                res.status(500);
                res.json({ err: 'Oops!' });
                cb('error');
            }
        });
    }

    getMessages(req, res) {
        let pagination = JSON.parse(req.query.pagination);

        if (pagination) {
            dataController.getSentMessages(req.user, pagination, (result)=>{
                res.status(200);
                res.json(result)
            })
        } else {
            res.status(400);
            res.json({
                'err': 'no pagination'
            })
        }
    }
}

module.exports = new HomeController();
