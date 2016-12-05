    require('../database/models/messages');

let mongoose    = require('mongoose'),
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
}

module.exports = new UserController();
