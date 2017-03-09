import '../database/models/users';

import crypto      from 'crypto';
import mongoose    from 'mongoose';
import config      from '../config/messages';
import nodemailer  from 'nodemailer';

const User = mongoose.model('User');

class RestorePasswordFlow {
    constructor() {
        this.smtpTransport  = nodemailer.createTransport(config.nodemailer);
    }

    sendLink(req, res) {
        let token = crypto.randomBytes(16).toString('hex');

        User.findOne({ email: req.body.email }, (err, user) => {

            if (!user) {
                res.error(400, {'message': 'No account with that email address exists.'});

            } else {
                user.setRestorePasswordData(token);

                let mailOptions = config.restorePassword(user.email, token);

                this.smtpTransport.sendMail(mailOptions, function(err) {
                    if (err) {
                        res.error(500, err);
                        return;
                    }

                    res.success(200,{
                        'message': `An e-mail has been sent to ${user.email} 
                                    with further instructions.`
                    });
                });
            }
        });
    }

    restore(req, res) {
        let
            query = { resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } };

        User.findOne(query, function(err, user) {
            if (!user) {
                res.error(401, {'message': 'Password reset token is invalid or has expired.'});
            } else {
                RestorePasswordFlow.savePassword(user, req.body.password);

                res.success(200, {'message' : 'You have successfully changed your password'});
            }
        });
    }

    setNewPassword(req, res) {
        let password = req.body.password;

        User.findOne({_id: req.user._id})
            .then(user => {
                if (!user) {
                    res.error(401, {'message': 'User not found!'});
                    return;
                }

                if (!user.validPassword(password.old)) {
                    res.error(404, {'message': 'Old password is invalid!'});
                    return;
                }

                RestorePasswordFlow.savePassword(user, password.new);
                res.success(200, {'message' : 'You have successfully changed your password'});

        });
    }

    static savePassword(user, pass) {
        console.log(user.password);
        user.password = pass;
        user.markModified('admin');
        user.save();
    }
}

export default new RestorePasswordFlow();