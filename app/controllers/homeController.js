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
        let user    = req.user;
        let fields = {name : 1, email : 1};

        User.findOne({_id: user._id}, fields, (err, user) => {
            if (user) {
                User.find({_id: {$ne : user._id}}, fields, (err, usersList) => {
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
        let type  = req.query.messageType;
        let sortByDate          = req.query.sortByDate;

        if (pagination) {
            dataController.getMessages(req.user, pagination, type, (result)=>{
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

    searchInMessages(req, res) {
        let pagination          = JSON.parse(req.query.pagination);
        let searchName          = req.query.searchName;

        if (pagination) {
            User.findOne({name: searchName}, {email:1}, (err, user)=>{
                if (user) {
                    dataController.getMessagesByName(req.user, user.email, pagination, (result)=>{
                        res.status(200);
                        res.json(result)
                    })
                }
            });

        } else {
            res.status(400);
            res.json({
                'err': 'no pagination'
            })
        }
    }
}

module.exports = new HomeController();
