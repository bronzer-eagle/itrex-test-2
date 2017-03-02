let
    _                   = require('underscore'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User');

class AdminController {
    constructor() {}

    //TODO: set promise

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
                helper.success(200, {token}, res);
            } else {
                helper.error(500, {
                    'error' : 'There is no user with that id, please check your data'
                }, res);
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

                        helper.success(200, {message : 'You have successfully assign new admins!'}, res);
                    });
            });
    }
}

module.exports = new AdminController();