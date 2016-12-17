    require('../database/models/messages');

let _           = require('underscore'),
    mongoose    = require('mongoose'),
    Message     = mongoose.model('Message'),
    path        = require('path');
    nodemailer  = require('nodemailer');

class UserController {
    constructor() {
        this.smtpTransport          = nodemailer.createTransport({
            host                    : 'smtp.gmail.com',
            port                    : 465,
            secure                  : true,
            auth                    : {
                user                : process.env.email,
                pass                : process.env.emailPass
            }
        });
    }

    sendMessage(req, res) {
        let file, mailOptions, receivers, message;

        receivers                   = _.map(req.body.message.receivers, res => { return res.email});

        mailOptions                 = {
            to                      : receivers,
            from                    : req.user.email,
            subject                 : req.body.message.subject,
            text                    : req.body.message.text
        };

        if (req.files.file) {
            file                    = req.files.file;

            mailOptions.attachments = [{
                filename            : file.name,
                path                : file.path,
                contentType         : file.type,
                headers             : file.headers
            }]
        }

        receivers                   = _.map(receivers, res => {return {email: res, is_read: false}});

        message = Message({
            text                    : req.body.message.text,
            subject                 : req.body.message.subject,
            sender                  : req.user._id,
            receivers               : receivers,
            attachment              : file
        });

        message.save();

        this.smtpTransport.sendMail(mailOptions, function(err) {
            if (err) {
                res.status(500).json(err);
                return;
            }

            res.status(200).json({
                'message': 'An e-mail has been sent to ' + receivers + ' with further instructions.'
            });
        });
    }
}

module.exports = new UserController();
