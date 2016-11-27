let     passport    = require('passport'),
        mongoose    = require('mongoose'),
        User        = mongoose.model('User');

class AuthFlow {
    constructor() {

    }

    register(req, res) {
        let user, token, flag;

        console.log(this);

        flag = this.validate(req, res);

        if (!flag) return;

        user = new User();

        user.name   = req.body.name;
        user.email  = req.body.email;

        user.setPassword(req.body.password);

        user.save((err) => {
            if (err) AuthFlow.processFail(err);

            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        });

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
        if(!req.body.email || !req.body.password) {
          AuthFlow.sendJSONresponse(res, 400, {
            "message": "All fields required"
          });

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