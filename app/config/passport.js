require('../controllers/emailVerification').init();

let
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    mongoose        = require('mongoose'),
    User            = mongoose.model('User'),
    TempUser        = mongoose.model('tempusers');

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (username, password, done) => {
        User.findOne({ email: username })
            .exec((err, user) => {
                if (err) return done(err);

                if (!user) {
                    TempUser.findOne({ email: username }, (err, tempuser) => {
                        if (err) return done(err);

                        if (tempuser) {
                            return done(null, false, {
                                message: 'Verify your email'
                            });
                        } else {
                            return done(null, false, {
                                message: 'Email or password is wrong'
                            });
                        }
                    });
                } else {
                    if (!user.validPassword(password)) {
                        return done(null, false, {
                            message: 'Email or password is wrong'
                        });
                    } else {
                        return done(null, user);
                    }
                }
            });
    }
));
