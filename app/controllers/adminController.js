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
}

module.exports = new AdminController();