let
    _                   = require('underscore'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User');

class AdminController {
    constructor() {}

    checkAdminList(user, callback) {
        User.findOne({admin: true}, function (err, admin) {
            if (!admin) {
                user.setAdmin(true);
            }

            callback();
        });
    }

    setWatchAsMe(req, res) {
        User.findById(req.body.userId, function (err, user) {
            if (user) {
                let token = user.generateJwt({
                    adminWatch : true
                });
                res.status(200);
                res.json({
                    token
                })
            } else {
                res.status(500);
                res.json({
                    'error' : 'There is no user with that id, please check your data'
                })
            }
        })
    }

    setAdmins(req, res) {
        let
            admins = req.body.admins;

        User
            .find({_id: {$ne: req.user._id}, admin : true, superAdmin : {$ne: true}})
            .exec((err, users) => {
                let
                    deleteAdmins    = _.filter(users, item => !admins.includes(item._id));

                _.each(deleteAdmins, item => {
                    item.removeAdmin();
                });

                User.find({_id : {$in : admins}})
                    .exec((err, users) => {

                        _.each(users, item => {
                            item.setAdmin();
                        });

                        res.status(200).json({
                            message : 'You have successfully assign new admins!'
                        });
                    });
            });
    }
}

module.exports = new AdminController();