let
    express                 = require('express'),
    authRoutes              = express.Router(),
    testRoutes              = express.Router(),
    protectedRoutes         = express.Router(),
    adminRoutes             = express.Router(),
    emailVerification       = require('./controllers/emailVerification'),
    auth                    = require('./controllers/auth.js'),
    mongoose                = require(`mongoose`),
    multipart               = require('connect-multiparty'),
    userController          = require(`./controllers/userController`),
    homeController          = require(`./controllers/homeController`),
    adminController          = require(`./controllers/adminController`),
    restorePass             = require('./controllers/restorePasswordController');

//auth flow

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

//protected routes

protectedRoutes.get('/user-data',                       homeController.sendData.bind(homeController));
protectedRoutes.get('/get-messages',                    homeController.getMessages.bind(homeController));
protectedRoutes.get('/read-message',                    homeController.readMessage.bind(homeController));
protectedRoutes.post('/send-message',                   multipart({uploadDir: './storage' }), userController.sendMessage.bind(userController));
protectedRoutes.post('/change-password',                restorePass.setNewPassword.bind(restorePass));
protectedRoutes.post('/change-name',                    userController.changeName.bind(userController));
protectedRoutes.post('/change-email',                   userController.sendLinkToRestoreEmail.bind(userController));
protectedRoutes.post('/change-blacklist',               userController.changeBlacklist.bind(userController));

//admin routes

adminRoutes.post('/set-watch-as-me',                    adminController.setWatchAsMe.bind(adminController));
adminRoutes.post('/set-admins',                         adminController.setAdmins.bind(adminController));

module.exports = [authRoutes, testRoutes, protectedRoutes, adminRoutes];