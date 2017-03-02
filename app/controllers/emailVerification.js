require('../database/models/users');

let
    mongoose            = require('mongoose'),
    nev                 = require('email-verification')(mongoose),
    User                = mongoose.model('User'),
    config              = require('../config/messages').emailVerification(User),
    adminController     = require('./adminController');

class EmailVerification {
    constructor () {}

    init() {
        nev.configure(config, (error) => {
            if (error) throw new Error(error);
        });

        nev.generateTempUserModel(User, (error) => {
            if (error) throw new Error(error);
        });
    }

    sendVerification(newUser, res) {
        nev.createTempUser(newUser, (err, userExists, newTempUser) => {
            if (err) {
                helper.error(404, {error : 'Creating temp user FAILED'}, res);
                return;
            }

            if (userExists) {
                helper.error(400, {
                    message: 'You have already signed up and confirmed your account. Did you forget your password?'
                }, res);

                return;
            }

            if (newTempUser) {
                let
                    URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(newUser.email, URL, (err, info) => {
                    if (err) {
                        helper.error(404, {error: 'ERROR: sending verification email FAILED'}, res);
                    }
                    helper.success(200, {
                        message: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    }, res);
                });

            } else {
                helper.error(400, {
                    message: 'You have already signed up. Please check your email to verify your account.'
                }, res);
            }
        });
    }

    resendVerification(req, res) {
        nev.resendVerificationEmail(req.query.email, (err, userFound) => {
            if (err) {
                helper.error(404, {
                    message: 'ERROR: resending verification email FAILED'
                }, res);

                return;
            }

            if (userFound) {
                helper.success(200, {
                    message: 'An email has been sent to you, yet again. Please check it to verify your account.'
                }, res);
            } else {
                helper.error(400, {
                    message: 'Your verification code has expired. Please sign up again.'
                }, res);
            }
        });
    }

    verify(req, res) {
        let
            token = req.body.token;

        nev.confirmTempUser(token, function(err, user) {
            if (user) {
                adminController.checkAdminList(user, ()=>{
                    helper.success(200, {
                        message: 'CONFIRMED!'
                    }, res);
                });
                nev.sendConfirmationEmail(user.email, function(err) {
                    if (err) {
                        helper.error(404, {
                            message : 'ERROR: sending confirmation email FAILED'
                        }, res);
                    }
                });
            } else {
                helper.error(404, {
                    message: 'ERROR: confirming temp user FAILED'
                }, res);
            }
        });
    }
}

module.exports = new EmailVerification();



