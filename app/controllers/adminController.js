let _                   = require('underscore'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User');

class AdminController {
    constructor() {}

    checkAdminList() {
        User.findOne({admin: true}).then(admin => admin);
    }

    setWatchAsMe(req, res) {
        User.findById(req.body.userId, (err, user) => {
            if (user) {
                let token = user.generateJwt({adminWatch : true});

                res.success(200, {token});
            } else {
                res.error(500, {'error' : 'There is no user with that id, please check your data'});
            }
        })
    }

    changeAdmins(req, res) {
        let admins = req.body.admins;

        User.find({_id: {$ne: req.user._id}, admin : true, superAdmin : {$ne: true}})
            .then((users) => {
                let deleteAdmins    = _.filter(users, item => !admins.includes(item._id));

                AdminController.removeAdmins(deleteAdmins);

                AdminController.setAdmins(admins)
                    .then(() => {
                        res.success(200, {message : 'You have successfully assign new admins!'});
                    })
            });
    }

    static removeAdmins(arr) {
        _.each(arr, item => {
            item.removeAdmin();
        });
    }

    static setAdmins(arr) {
        return User.find({_id : {$in : arr}})
            .then((users) => {
                _.each(users, item => {
                    item.setAdmin();
                });
            });
    }
}

module.exports = new AdminController();