require('../database/models/users');

let crypto = require('crypto'),
    mongoose = require('mongoose'),
    User    = mongoose.model('User'),
    nodemailer = require('nodemailer');
class RestorePasswordFlow {
    constructor() {

    }

    sendLink(req, res) {
        let token = crypto.randomBytes(16).toString('hex');

        User.findOne({ email: req.body.email }, (err, user) => {

            if (!user) {
                res.status(401);
                res.json({
                    'error': 'No account with that email address exists.'
                });

                res.redirect('/forgot');
            } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    if (err) throw new Error(err);
                });

                let mailOptions = {
                    to: user.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/auth/restore-password/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
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

                smtpTransport.sendMail(mailOptions, function(err) {
                    if (err) throw new Error(err);
                    res.status(200);
                    res.json({
                        'message': 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                    });
                });
            }
        });
    }

    checkUser(req, res){
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                res.status(401);
                res.json({'error': 'Password reset token is invalid or has expired.'});
            } else {
                console.log('get');
                res.status(200);
                res.json({});
            }
        });
    }

    restore(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                res.status(401);
                res.json({'error': 'Password reset token is invalid or has expired.'});
            } else {
                user.setPassword(req.body.password, true);
                res.status(200);
                res.json({});
            }
        });
    }
}

module.exports = new RestorePasswordFlow();

