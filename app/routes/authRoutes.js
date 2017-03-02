/**
 * Created by alexander on 02.03.17.
 */
let
    express                 = require('express'),
    authRoutes              = express.Router(),
    emailVerification       = require('../controllers/emailVerification'),
    auth                    = require('../controllers/auth.js'),
    userController          = require(`../controllers/userController`),
    restorePass             = require('../controllers/restorePasswordController');

authRoutes.post('/register',                        auth.register.bind(auth));
authRoutes.post('/login',                           auth.login.bind(auth));
authRoutes.post('/forgot-password',                 restorePass.sendLink.bind(restorePass));
authRoutes.post('/restore-user-password',           restorePass.restore.bind(restorePass));
authRoutes.get('/resend-verification',              emailVerification.resendVerification.bind(emailVerification));

authRoutes.get('/logout', (req, res) => {
    req.logout();
    res.status(200);
    res.json({});
});
authRoutes.post('/email-confirmation', (req, res) => {
    if (req.body.notNewUser) {
        userController.changeEmail(req, res);
    } else {
        emailVerification.verify(req, res);
    }
});

module.exports = authRoutes;