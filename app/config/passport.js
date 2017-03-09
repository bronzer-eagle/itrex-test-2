import emailVerification from '../controllers/emailVerification';

emailVerification.init();

let strategy;

import passport      from 'passport';
import passportLocal from 'passport-local';
import mongoose      from 'mongoose';

const LocalStrategy = passportLocal.Strategy,
      User          = mongoose.model('User'),
      TempUser      = mongoose.model('tempusers');

strategy = new LocalStrategy({usernameField: 'email'},
    (username, password, done) => {
        User.findOne({ email: username })
            .then(user => {
                if (!user) {
                    FindInTempUsers(username)
                        .then(result => {
                            done(null, false, result)
                        })
                } else {
                    if (!user.validPassword(password)) {
                        return done(null, false, {message: 'Email or password is wrong'});
                    }

                    return done(null, user);
                }
            })
            .catch(err => {
                done(err)
            })
    }
);

function FindInTempUsers(username) {
    return TempUser.findOne({ email: username })
        .then(tempuser => {
            return  {message: tempuser ? 'Verify your email' : 'Email or password is wrong'}
        });
}

passport.use(strategy);
