require('../database/models/users');

let mongoose            = require('mongoose'),
    nev                 = require('email-verification')(mongoose),
    User                = mongoose.model('User'),
    adminController     = require('./adminController');

class EmailVerification {
    constructor () {}

    init() {
        nev.configure({
            verificationURL     : `http://localhost:8080/auth/email-verification/\${URL}`, //TODO: make .env
            persistentUserModel : User,
            tempUserCollection  : 'tempusers',
            shouldSendConfirmation: false,

            transportOptions    : {
                service         : 'Gmail',
                auth            : {
                    user        : process.env.email, //TODO: make .env
                    pass        : process.env.emailPass //TODO: make .env
                }
            },
            verifyMailOptions   : {
                from            : 'Do Not Reply <itrex-task@gmail.com>',
                subject         : 'Please confirm account',
                html            : '<p>Click the following link to confirm your account:</p>'+
                                    '<a href="${URL}">${URL}</a>',
                text            : 'Please confirm your account by clicking the following link: ${URL}'
            }
        }, (error) => {
            if (error) console.log(error);
        });

        nev.generateTempUserModel(User, function(err) {
            if (error) console.log(error);
        });
    }

    sendVerification(newUser, res) {
        nev.createTempUser(newUser, function(err, userExists, newTempUser) {
            if (err) return res.status(404).send('ERROR: creating temp user FAILED');

            if (userExists) {
                return res.json({
                    msg: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }

            if (newTempUser) {
                let URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(newUser.email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    res.json({
                        msg: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });
    }

    resendVerification(req, res) {
        nev.resendVerificationEmail(req.query.email, function(err, userFound) {
            if (err) {
                return res.status(404).send('ERROR: resending verification email FAILED');
            }

            if (userFound) {
                res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    }

    verify(req, res) {
        let url = req.params.URL;

        nev.confirmTempUser(url, function(err, user) {
            if (user) {
                nev.sendConfirmationEmail(user.email, function(err, info) {
                    if (err) return res.status(404).send('ERROR: sending confirmation email FAILED');

                    adminController.checkAdmin(user);

                    res.json({
                        msg: 'CONFIRMED!',
                        info: info
                    });
                });
            } else {
                return res.status(404).send('ERROR: confirming temp user FAILED');
            }
        });
    }
}

module.exports = new EmailVerification();



