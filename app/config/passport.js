let     passport        = require('passport'),
        LocalStrategy   = require('passport-local').Strategy,
        mongoose        = require('mongoose'),
        User            = mongoose.model('User');

        require('../controllers/emailVerification').init();

        TempUser        = mongoose.model('tempusers');

let callback = function (username, password, done, err, user, tempUser) {
    console.log(arguments);
    if (err) return done(err);

    if (!user) {
        if (tempUser == undefined) {
            TempUser.findOne({ email: username }, (tempusererr, tempuser) => {
                tempuser = tempuser || false;
                callback(username, password, done, err, user, tempuser);
            });
        }
        else if (tempUser) {
            return done(null, false, {
                message: 'Verify your email'
            });
        }
        else {
            return done(null, false, {
                message: 'User not found'
            });
        }

    } else {
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Password is wrong'
            });
        }

        return done(null, user);
    }

};

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },

    (username, password, done) => {
        User.findOne({ email: username }, callback.bind(null, username, password, done));
    }
));
