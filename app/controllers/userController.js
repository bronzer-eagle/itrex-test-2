    require('../database/models/messages');

let _           = require('underscore'),
    mongoose    = require('mongoose'),
    Message     = mongoose.model('Message'),

    path        = require('path');
    nodemailer  = require('nodemailer');

class UserController {
    constructor() {

    }

    sendMessage(req, res) {
        if (req.files) {
            let file = req.files.file;
            console.log(file);
            var pathToFile = file.path;
        }

        let receivers = _.map(req.body.message.receivers, res => { return res.email});

        let mailOptions = {
            to: receivers,
            from: req.user.email,
            subject: req.body.message.subject,
            text: req.body.message.text
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
            text : req.body.message.text,
            subject : req.body.message.subject,
            sender : req.user._id,
            receivers : receivers,
            attachment: pathToFile
        });

        message.save();

        smtpTransport.sendMail(mailOptions, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            res.status(200);
            res.json({
                'message': 'An e-mail has been sent to ' + receivers + ' with further instructions.'
            });
        });
    }
}

module.exports = new UserController();
