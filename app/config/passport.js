require('../controllers/emailVerification').init();

let
    strategy, result,
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    mongoose        = require('mongoose'),
    User            = mongoose.model('User'),
    TempUser        = mongoose.model('tempusers');

strategy = new LocalStrategy({usernameField: 'email'},
    (username, password, done) => {
        User.findOne({ email: username })
            .exec((err, user) => {
                if (err) return done(err);

                if (!user) {
                    TempUser.findOne({ email: username }, (err, tempuser) => {
                        if (err) return done(err);

                        if (tempuser) {
                            result = {message: 'Verify your email'};
                        } else {
                            result = {message: 'Email or password is wrong'};
                        }

                        return done(null, false, result)
                    });
                } else {
                    if (!user.validPassword(password)) {
                        return done(null, false, {
                            message: 'Email or password is wrong'
                        });
                    }

                    return done(null, user);
                }
            });
    }
);

passport.use(strategy);
