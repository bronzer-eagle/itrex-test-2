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

        passport.authenticate('local', (err, user) => {
            if (err) {
                helper.error(404, err, res);
                return;
            }

            if (user) {
                helper.success(200, {'token' : user.generateJwt()}, res);
            } else {
                helper.error(401, {message : 'Not authorized'}, res);
            }
        })(req, res);
    };

    static validate(req, res, type) {
        let
            arr     = validator.validate(req.body, type),
            errors  = this.getErrors(arr);

        if (errors.length) {
            helper.error(400, {errors : errors}, res);
            return false;
        }

        return true;
    }

    getErrors(arr) {
        return _.filter(arr, item => !item.flag);
    }
}

module.exports = new AuthFlow();