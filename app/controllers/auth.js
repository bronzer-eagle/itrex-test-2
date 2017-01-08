let
    _                   = require('underscore'),
    passport            = require('passport'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User'),
    validator           = require('../helpers/validator.js'),
    emailVerification   = require('./emailVerification');

class AuthFlow {
    constructor() {}

    register(req, res) {
        let
            user;

        if (!AuthFlow.validate(req, res, 'registration')) return;

        user = new User({
            name   : req.body.name,
            email  : req.body.email
        });

        user.setPassword(req.body.password);

        emailVerification.sendVerification(user, res);
    };

    login(req, res) {
        if (!AuthFlow.validate(req, res, 'login')) return;

        passport.authenticate('local', function(err, user, info){
            if (err) {
                res.status(404).json(err);
                return;
            }

            if (user) {
                res.status(200).json({'token' : user.generateJwt()});
            } else {
                res.status(401).json(info);
            }

        })(req, res);
    };

    static validate(req, res, type) {
        let
            arr     = validator.validate(req.body, type),
            errors  = getErrors();

        if (errors) {
            AuthFlow.sendJSONresponse(res, 400, {errors : errors});

            return false;
        }

        return true;

        function getErrors() {
            _.filter(arr, item => {
                return !item.flag
            });
        }
    }

    static sendJSONresponse(res, status, content) {
        res.status(status).json(content);
    };
}

module.exports = new AuthFlow();