let express                 = require('express'),
    authRoutes              = express.Router(),
    testRoutes              = express.Router(),
    protectedRoutes         = express.Router(),
    adminRoutes             = express.Router(),
    emailVerification       = require('./controllers/emailVerification'),
    auth                    = require('./controllers/auth.js'),
    mongoose                = require(`mongoose`),
    userController          = require(`./controllers/userController`),

    restorePass             = require('./controllers/restorePassword');

//auth flow

authRoutes.get('/restore-password/:token', (req, res) => {
    restorePass.checkUser(req, res);
});

authRoutes.post('/restore-password/:token', (req, res) => {
    restorePass.restore(req, res);
});

authRoutes.post('/register', auth.register.bind(auth));
authRoutes.post('/login', auth.login.bind(auth));
authRoutes.post('/restore-password', auth.restorePassword.bind(auth));
authRoutes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

authRoutes.get('/email-verification/:URL', function(req, res) {
    emailVerification.verify(req, res);
});

authRoutes.post('/resend-verification', function(req, res) {
    emailVerification.resendVerification(req, res);
});

//test db routes

testRoutes.get('/users', function (req, res) {
    mongoose.model('User').find({}, (err, users) => {
        res.json(users);
    })
});

testRoutes.get('/temp-users', function (req, res) {
    mongoose.model('tempusers').find({}, (err, users) => {
        res.json(users);
    })
});

//protected routes

protectedRoutes.get('/user-data', function (req, res) {
    res.status(200);
    res.json({
        'msg' : 'user-data'
    })
});

protectedRoutes.post('/send-message', userController.sendMessage.bind(userController));



//admin routes

adminRoutes.get('/admin-data', function (req, res) {
    res.status(200);
    res.json({
        'msg' : 'admin-data'
    })
});

module.exports = [authRoutes, testRoutes, protectedRoutes, adminRoutes];