require('../database/models/users');

let mongoose            = require('mongoose'),
    nev                 = require('email-verification')(mongoose),
    User                = mongoose.model('User'),
    adminController     = require('./adminController');

class EmailVerification {
    constructor () {}

    init() {
        nev.configure({
            verificationURL     : `${process.env.appHttp}auth/email-verification?token=\${URL}`,
            persistentUserModel : User,
            tempUserCollection  : 'tempusers',
            shouldSendConfirmation: false,

            transportOptions    : {
                service         : 'Gmail',
                auth            : {
                    user        : process.env.email,
                    pass        : process.env.emailPass
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

        nev.generateTempUserModel(User, function(error) {
            if (error) console.log(error);
        });
    }

    sendVerification(newUser, res) {
        nev.createTempUser(newUser, function(err, userExists, newTempUser) {
            if (err) return res.status(404).send('ERROR: creating temp user FAILED');

            if (userExists) {
                return res.json({
                    message: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }

            if (newTempUser) {
                let URL = newTempUser[nev.options.URLFieldName];

                nev.sendVerificationEmail(newUser.email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    res.json({
                        message: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

            } else {
                res.json({
                    message: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });
    }

    resendVerification(req, res) {
        nev.resendVerificationEmail(req.query.email, function(err, userFound) {
            if (err) {
                return res.status(404).send({
                    message: 'ERROR: resending verification email FAILED'
                });
            }

            if (userFound) {
                res.json({
                    message: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    message: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    }

    verify(req, res) {
        let token = req.body.token;

        nev.confirmTempUser(token, function(err, user) {
            if (user) {
                adminController.checkAdmin(user, ()=>{
                    res.status(200);
                    res.json({
                        message: 'CONFIRMED!'
                    });
                });
                nev.sendConfirmationEmail(user.email, function(err) {
                    if (err) return res.status(404).send({
                        message : 'ERROR: sending confirmation email FAILED'
                    });
                });
            } else {
                return res.status(404).send({
                    message: 'ERROR: confirming temp user FAILED'
                });
            }
        });
    }
}

module.exports = new EmailVerification();



