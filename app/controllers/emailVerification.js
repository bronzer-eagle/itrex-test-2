require('../database/models/users');

let
    mongoose            = require('mongoose'),
    nev                 = require('email-verification')(mongoose),
    User                = mongoose.model('User'),
    config              = require('../config/messages'),
    adminController     = require('./adminController');

class EmailVerification {
    constructor () {}

    init() {
        nev.configure(config.emailVerification(User), (error) => {
            if (error) throw new Error(error);
        });

        nev.generateTempUserModel(User, (error) => {
            if (error) throw new Error(error);
        });
    }

    sendVerification(newUser, res) {
        nev.createTempUser(newUser, (err, userExists, newTempUser) => {
            if (err) {
                res.error(404, {error : 'Creating temp user FAILED'});
                return;
            }

            if (userExists) {
                res.error(400, {
                    message: `You have already signed up and 
                              confirmed your account. 
                              Did you forget your password?`
                });
                return;
            }

            if (newTempUser) {
                let URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(newUser.email, URL, (err, info) => {
                    if (err) {
                        res.error(404, {error: 'ERROR: sending verification email FAILED'});
                    }

                    res.success(200, {
                        message: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

            } else {
                res.error(400, {
                    message: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });
    }

    resendVerification(req, res) {
        nev.resendVerificationEmail(req.query.email, (err, userFound) => {
            if (err) {
                res.error(404, {message: 'ERROR: resending verification email FAILED'});
                return;
            }

            if (userFound) {
                res.success(200, {
                    message: `An email has been sent to you, yet again. 
                              Please check it to verify your account.`
                });
            } else {
                res.error(400, {message: 'Your verification code has expired. Please sign up again.'});
            }
        });
    }

    verify(req, res) {
        let token = req.body.token;

        nev.confirmTempUser(token, (err, user) => {
            if (user) {
                adminController.checkAdminList(user)
                    .then((res)=>{
                        if (!res) user.setAdmin(true);

                        res.success(200, {message: 'CONFIRMED!'});
                    });

                nev.sendConfirmationEmail(user.email, (err) => {
                    if (!err) return;

                    res.error(404, {message : 'ERROR: sending confirmation email FAILED'});
                });
            } else {
                res.error(404, {message: 'ERROR: confirming temp user FAILED'});
            }
        });
    }
}

module.exports = new EmailVerification();



