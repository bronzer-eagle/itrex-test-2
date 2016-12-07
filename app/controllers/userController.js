    require('../database/models/messages');

let _           = require('underscore'),
    mongoose    = require('mongoose'),
    Message        = mongoose.model('Message'),
    nodemailer = require('nodemailer');

class UserController {
    constructor() {

    }

    sendMessage(req, res) {
        console.log(req.body);

        let mailOptions = {
            to: req.body.receiver.email,
            from: req.body.sender.email,
            subject: req.body.message.subject,
            text: req.body.message.body
        };

        let smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.email,
                pass: process.env.emailPass
            }
        });
        
        let message = new Message({
            body : req.body.message.body,
            subject : req.body.message.subject,
            sender : req.body.sender.id,
            receiver : req.body.receiver.id
        });

        message.save();

        smtpTransport.sendMail(mailOptions, function(err) {
            if (err) throw new Error(err);
            res.status(200);
            res.json({
                'message': 'An e-mail has been sent to ' + req.body.receiver.email + ' with further instructions.'
            });
        });
    }

    createUserData(user) {
        if (_.isArray(user)) {
            return _.map(user, filterData);
        } else {
            return filterData(user)
        }

        function filterData(user) {
            return _.pick(user, 'name', 'email')
        }
    }
}

module.exports = new UserController();
