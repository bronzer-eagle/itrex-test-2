require('../database/models/users');

let crypto = require('crypto'),
    mongoose = require('mongoose'),
    User    = mongoose.models('User'),
    nodemailer = require('nodemailer')
    ;
class RestorePasswordFlow {
    constructor() {
        this.smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {
                user: '!!! YOUR SENDGRID USERNAME !!!',
                pass: '!!! YOUR SENDGRID PASSWORD !!!'
            }
        });

        this.mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
    }

    restore(req, res) {
        let token = crypto.randomBytes(16).toString('hex');

        User.findOne({ email: req.body.email }, function(err, user) {

            if (!user) {
                res.status(401);
                res.json({
                    'error': 'No account with that email address exists.'
                });

                res.redirect('/forgot');
            } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save();

                this.smtpTransport.sendMail(this.mailOptions, function(err) {
                    res.status(200);
                    res.json({
                        'message': 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                    });
                });
            }
        });
    }


}

