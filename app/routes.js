let express             = require('express'),
    apiRoutes           = express.Router(),
    emailVerification   = require('./controllers/emailVerification'),
    auth                = require('./controllers/auth.js'),
    mongoose            = require(`mongoose`),
    jwt                 = require('express-jwt');

let jwtCheck = jwt({
    secret: process.env.JWTSecret
});

// apiRoutes.get('/restore-password/:URL', jwtCheck, (req, res) => {
//     console.log(req.user);
//     res.sendStatus(200);
// });
//
// apiRoutes.post('/restore-password/:URL', jwtCheck, (req, res) => {
//     console.log(req.user);
//     res.sendStatus(200);
// });

apiRoutes.get('/users', function (req, res) {
    mongoose.model('User').find({}, (err, users) => {
        res.json(users);
    })
});

apiRoutes.get('/temp-users', function (req, res) {
    mongoose.model('tempusers').find({}, (err, users) => {
        res.json(users);
    })
});

apiRoutes.post('/register', auth.register.bind(auth));
apiRoutes.post('/login', auth.login.bind(auth));
apiRoutes.post('/restore-password', auth.restorePassword.bind(auth));
apiRoutes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

apiRoutes.get('/email-verification/:URL', function(req, res) {
    emailVerification.verify(req, res);
});

apiRoutes.post('/resend-verification', function(req, res) {
    emailVerification.resendVerification(req, res);
});

module.exports = apiRoutes;