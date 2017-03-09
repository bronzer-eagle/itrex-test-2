import '../database/models/users';

import _          from 'underscore';
import crypto     from 'crypto';
import mongoose   from 'mongoose';
import config     from '../config/messages';
import nodemailer from 'nodemailer';

const Message = mongoose.model('Message'),
      User    = mongoose.model('User');

class UserController {
    constructor() {
        this.smtpTransport = nodemailer.createTransport(config.nodemailer);
    }

    sendLinkToRestoreEmail(req, res) {
        let token = crypto.randomBytes(16).toString('hex');

        User.findOne({ _id: req.user._id }).then(user => {

            if (!user) {
                res.error(401, {'message': 'No user exists.'});
                return;
            }

            user.changeEmailToken     = token;
            user.tempEmail            = req.body.email;
            user.changeEmailExpires   = Date.now() + 3600000;
            user.save();

            let mailOptions = config.restoreEmail(user.email, token);

            this.smtpTransport.sendMail(mailOptions, (err) => {
                if (err) {
                    res.error(500, err);
                    return;
                }

                res.success(200, {
                    'message': `An e-mail has been sent to ${req.body.email} with further instructions.`
                });
            });

        });
    }

    changeEmail(req, res) {
        let query = { changeEmailToken: req.body.token, changeEmailExpires: { $gt: Date.now() } };

        User.findOne(query).then(user => {
            if (!user) {
                res.error(401, {'message': 'Email reset token is invalid or has expired.'});
            } else {
                user.setNewEmail();
                res.success(200, {'message' : 'You have successfully changed your email'});
            }
        });
    }

    sendMessage(req, res) {
        let file, mailOptions, receivers, message;

        receivers = _.map(req.body.message.receivers, res => { return res.email});

        if (receivers.length > 5) res.status(404).json('No more than 5 receivers!');

        mailOptions  = {
            to       : receivers,
            from     : req.user.email,
            subject  : req.body.message.subject,
            html     : req.body.message.text
        };

        if (req.files.file) {
            file = req.files.file;

            if (file.size > 5000000) {
                res.success(400, {'message': 'File cannot be more than 5MB'});
                return;
            }

            mailOptions.attachments = [{
                filename     : file.name,
                path         : file.path,
                contentType  : file.type,
                headers      : file.headers
            }]
        }

        receivers = _.map(req.body.message.receivers, res => {return {receiver: res._id, is_read: false}});

        message = Message({
            text        : req.body.message.text,
            subject     : req.body.message.subject,
            sender      : req.user._id,
            senderName  : req.user.name,
            receivers   : receivers,
            attachment  : file,
            date        : Date.now()
        });

        message.save();

        this.smtpTransport.sendMail(mailOptions, (err) => {
            if (err) {
                res.error(500, err);
                return;
            }

            res.success(200, {'message': 'An e-mail has been sent successfully.'});
        });
    }

    changeName(req, res) {
        let name = req.body.name;

        User.findOne({_id: req.user._id}, function(err, user) {
            if (!user) {
                res.error(401, {'message': 'User not found!'});
            } else {
                user.changeName(name);
                res.success(200, {'message' : 'You have successfully changed your name'});
            }
        });
    }

    changeBlacklist(req, res) {
        let blacklist = _.map(req.body.blacklist, item => item._id);

        User.findById(req.user._id, (err, user) => {
            if (user) {
                user.setBlacklist(blacklist);
                res.success(200, {
                    message : 'Blacklist was updated'
                })
            }
        })
    }
}

export default new UserController();