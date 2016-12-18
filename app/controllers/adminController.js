let //_                   = require('underscore'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User');

class AdminController {
    constructor() {

    }

    checkAdmin(user, callback) {
        User.findOne({admin: true}, function (err, admin) {
            if (!admin) {
                user.setAdmin();
            }

            callback();
        });
    }

    isAdmin(user, res, callback) {
        User.findOne({email: user.email, admin: true}, function (err, user) {
            if (user) {
                callback();
            } else {
                res.status(401);
                res.json({
                    'error' : 'not admin'
                })
            }
        })
    }
}

module.exports = new AdminController();