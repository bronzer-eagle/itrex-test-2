import passport          from 'passport';
import mongoose          from 'mongoose';
import emailVerification from './emailVerification';

let User = mongoose.model('User');

class AuthFlow {
    constructor() {}

    register(req, res) {
        let user = new User({
            name   : req.body.name,
            email  : req.body.email,
            password: req.body.password
        });

        emailVerification.sendVerification(user, res);
    };

    login(req, res) {
        passport.authenticate('local', (err, user) => {
            if (err) {
                res.error(404, err);
                return;
            }

            if (user) {
                res.success(200, {'token' : user.generateJwt()});
            } else {
                res.error(401, {message : 'Not authorized'});
            }
        })(req, res);
    };
}

export default new AuthFlow();