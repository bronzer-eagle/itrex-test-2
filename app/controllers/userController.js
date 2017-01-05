    require('../database/models/messages');

let _           = require('underscore'),
    crypto      = require('crypto'),
    mongoose    = require('mongoose'),
    Message     = mongoose.model('Message'),
    User        = mongoose.model('User'),
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

    sendLinkforRestoreEmail(req, res) {
        let token = crypto.randomBytes(16).toString('hex');

        User.findOne({ _id: req.user._id }, (err, user) => {

            if (!user) {
                res.status(401).json({
                    'message': 'No user exists.'
                });

            } else {
                user.changeEmailToken     = token;
                user.tempEmail            = req.body.email;
                user.changeEmailExpires   = Date.now() + 3600000;

                user.save();

                let mailOptions = {
                    to: req.body.email,
                    from: 'emailreset@demo.com',
                    subject: 'Node.js email Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    process.env.appHttp + 'auth/email-verification?token=' + token + '&notNewUser=true\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                this.smtpTransport.sendMail(mailOptions, function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                    }

                    res.status(200);
                    res.json({
                        'message': 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'
                    });
                });
            }
        });
    }

    changeEmail(req, res) {
        let query = { changeEmailToken: req.body.token, changeEmailExpires: { $gt: Date.now() } };

        User.findOne(query, function(err, user) {
            if (!user) {
                res.status(401);
                res.json({'message': 'Email reset token is invalid or has expired.'});
            } else {
                user.setNewEmail();
                res.status(200);
                res.json({'message' : 'You have successfully changed your email'});
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
            html                    : req.body.message.text
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

        receivers                   = _.map(req.body.message.receivers, res => {return {receiver: res._id, is_read: false}});

        message = Message({
            text                    : req.body.message.text,
            subject                 : req.body.message.subject,
            sender                  : req.user._id,
            senderName              : req.user.name,
            receivers               : receivers,
            attachment              : file,
            date                    : Date.now()
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

    changeName(req, res) {
        let name = req.body.name;

        User.findOne({_id: req.user._id}, function(err, user) {
            if (!user) {
                res.status(401);
                res.json({'message': 'User not found!'});
            } else {
                user.changeName(name);
                res.status(200);
                res.json({'message' : 'You have successfully changed your name'});
            }
        });
    }

    changeBlacklist(req, res) {
        let blacklist = _.map(req.body.blacklist, item => item._id);

        User.findById(req.user._id, (err, user) => {
            if (user) {
                user.setBlacklist(blacklist);
                res.status(200).json({
                    message : 'Blacklist was updated'
                })
            }
        })
    }
}

module.exports = new UserController();
