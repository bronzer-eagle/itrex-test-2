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

        flag = this.validate(req, res);

        if (!flag) return;

        user = new User({
            name   : req.body.name,
            email  : req.body.email
        });

        emailVerification.sendVerification(user, res);



        // user.setPassword(req.body.password);
        //
        // user.save((err) => {
        //     if (err) AuthFlow.processFail(err);
        //
        //     token = user.generateJwt();
        //     res.status(200);
        //     res.json({
        //         "token" : token
        //     });
        // });

    };

    login(req, res) {
        let user, token, flag;

        flag = this.validate(req, res);

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

    validate(req, res) {
        let arr = validator.validate(req.body, 'registration');

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