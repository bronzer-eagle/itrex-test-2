require('../database/database');

let mongoose        = require('mongoose'),
    Message         = mongoose.model('Message'),
    User            = mongoose.model('User'),
    nodemailer      = require('nodemailer'),
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
                        user: user,
                        usersList: usersList
                    });
                });
            } else {
                res.status(500);
                res.json({ err: 'Oops!' });
            }
        });

    }
}

module.exports = new HomeController();
