let _ = require('underscore');

let     passport    = require('passport'),
        mongoose    = require('mongoose'),
        User        = mongoose.model('User'),
        validator   = require('../helpers/validator.js'),
        emailVerification = require('./emailVerification');

class AuthFlow {
    constructor() {

    }

    register(req, res) {
        let user, token, flag;

        flag = this.validate(req, res, 'registration');

        if (!flag) return;

        console.log(req.body);

        user = new User({
            name   : req.body.name,
            email  : req.body.email
        });

        user.setPassword(req.body.password);

        emailVerification.sendVerification(user, res);
    };

    login(req, res) {
        let user, token, flag;

        flag = this.validate(req, res, 'login');

        if (!flag) return;

        passport.authenticate('local', function(err, user, info){

            if (err) {
                res.status(404).json(err);
                return;
            }

            if(user) {
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token" : token
                });

            } else {
                res.status(401).json(info);
            }
        })(req, res);
    };

    validate(req, res, type) {
        let arr = validator.validate(req.body, type);

        let errors = _.filter(arr, item => {
            return !item.flag
        });

        if (errors.length) {
            AuthFlow.sendJSONresponse(res, 400, {errors : errors});

            return false;
        }

        return true;
    }

    static sendJSONresponse(res, status, content) {
        res.status(status);
        res.json(content);
    };

    static processFail(err) {
        if (err) throw new Error(err.message);
    }
}

module.exports = new AuthFlow();