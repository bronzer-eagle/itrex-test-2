require('../database/models/users');

let
    crypto      = require('crypto'),
    mongoose    = require('mongoose'),
    User        = mongoose.model('User'),
    nodemailer  = require('nodemailer');

class RestorePasswordFlow {
    constructor() {
        this.smtpTransport  = nodemailer.createTransport({
            host            : 'smtp.gmail.com',
            port            : 465,
            secure          : true,
            auth            : {
                user        : process.env.email,
                pass        : process.env.emailPass
            }
        });
    }

    sendLink(req, res) {
        let
            token = crypto.randomBytes(16).toString('hex');

        User.findOne({ email: req.body.email }, (err, user) => {

            if (!user) {
                res.status(401).json({
                    'message': 'No account with that email address exists.'
                });

            } else {
                user.setRestorePasswordData(token);

                let
                    mailOptions = {
                        to      : user.email,
                        from    : 'Mailer',
                        subject : 'Password reset',
                        text    : `
                            You are receiving this because you (or someone else) have requested the reset of the password for your account.
                            Please click on the following link, or paste this into your browser to complete the process:
                            ${process.env.appHttp}auth/restore-password?token=${token} If you did not request this, please ignore this email and your password will remain unchanged.`,
                        html    : `
                            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
                            Please click on the following link, or paste this into your browser to complete the process:</p>
                            <a href="${process.env.appHttp}auth/restore-password?token=${token}">${process.env.appHttp}auth/restore-password?token=${token}</a>
                            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
                    };

                this.smtpTransport.sendMail(mailOptions, function(err) {
                    if (err) {
                        res.status(500).json(err);
                        return;
                    }

                    res.status(200).json({
                        'message': 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                    });
                });
            }
        });
    }

    restore(req, res) {
        let
            query = { resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } };

        User.findOne(query, function(err, user) {
            if (!user) {
                res.status(401).json({'message': 'Password reset token is invalid or has expired.'});
            } else {
                user.setPassword(req.body.password, true);
                res.status(200).json({'message' : 'You have successfully changed your password'});
            }
        });
    }

    setNewPassword(req, res) {
        let
            password = req.body.password;

        User.findOne({_id: req.user._id}, function(err, user) {
            if (!user) {
                res.status(401).json({'message': 'User not found!'});
            } else {

                if (user.validPassword(password.old)){
                    user.setPassword(password.new, true);
                    res.status(200).json({'message' : 'You have successfully changed your password'});
                } else {
                    res.status(404).json({'message': 'Old password is invalid!'});
                }

            }
        });
    }
}

module.exports = new RestorePasswordFlow();