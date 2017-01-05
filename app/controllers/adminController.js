let _                   = require('underscore'),
    mongoose            = require('mongoose'),
    User                = mongoose.model('User');

class AdminController {
    constructor() {

    }

    checkAdmin(user, callback) {
        User.findOne({admin: true}, function (err, admin) {
            if (!admin) {
                user.setAdmin(true);
            }

            callback();
        });
    }

    isAdmin(id, res, callback) {
        User.findById({_id: id, admin: true}, function (err, user) {
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
                    'error' : 'no user'
                })
            }
        })
    }

    setAdmins(req, res) {
        let admins = req.body.admins;

        User
            .find({_id: {$ne: req.user._id}, admin : true, superAdmin : {$ne: true}})
            .exec((err, users) => {
                let deleteAdmins    = _.filter(users, item => {
                    return !admins.includes(item._id);
                });

                _.each(deleteAdmins, item => {
                    item.removeAdmin();
                });

                User.find({_id : {$in : admins}})
                    .exec((err, users) => {

                        _.each(users, item => {
                            item.setAdmin();
                        });

                        res.sendStatus(200);
                    });
            });
    }
}

module.exports = new AdminController();