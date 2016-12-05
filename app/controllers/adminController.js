let //_                   = require('underscore'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User');

class AdminController {
    constructor() {

    }

    checkAdmin(user) {
        User.findOne({admin: true}, function (err, admin) {
            console.log(admin);

            if (!admin) {
                user.setAdmin();
            }
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