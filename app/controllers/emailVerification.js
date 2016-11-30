require('../database/models/users');

let mongoose = require('mongoose'),
    crypto              = require('crypto'),
    nev = require('email-verification')(mongoose);

let myHasher = function(password, tempUserData, insertTempUser, callback) {
    console.log(password);
    password = toString(password);
    tempUserData.salt = crypto.randomBytes(16).toString('hex');
    tempUserData.hash = crypto.pbkdf2Sync(password, tempUserData.salt, 1000, 64, 'sha512').toString('hex');
    return insertTempUser(tempUserData.hash, tempUserData, callback);
};

class EmailVerification {
    constructor () {
    }

    init() {
        let User = mongoose.model('User');

        nev.configure({
            verificationURL: `http://localhost:8080/api/email-verification/\${URL}`,
            persistentUserModel: User,
            tempUserCollection: 'tempusers',

            transportOptions: {
                service: 'Gmail',
                auth: {
                    user: 'bronzer2010@gmail.com',
                    pass: 'uS4foultY'
                }
            },
            //hashingFunction: myHasher,
            //passwordFieldName: 'password',
            verifyMailOptions: {
                from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
                subject: 'Please confirm account',
                html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
                text: 'Please confirm your account by clicking the following link: ${URL}'
            }
        }, function(error, options){
            console.log(error)
        });

        nev.generateTempUserModel(User, function(err, tempUserModel) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
        });
    }

    sendVerification(newUser, res) {
        console.log(newUser);
        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            if (err) {
                return res.status(404).send('ERROR: creating temp user FAILED');
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                return res.json({
                    msg: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }

            // new user created
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

                // user already exists in temporary collection!
            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });
    }

    resendVerification(req, res) {
        user = new User({
            name   : req.body.name,
            email  : req.body.email
        });

        user.setPassword(req.body.password);

        nev.resendVerificationEmail(user.email, function(err, userFound) {
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
                    if (err) {
                        return res.status(404).send('ERROR: sending confirmation email FAILED');
                    }
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



