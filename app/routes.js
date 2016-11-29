let express     = require('express'),
    apiRoutes   = express.Router(),
    emailVerification = require('./controllers/emailVerification');
    auth        = require('./controllers/auth.js');

const mongoose = require(`mongoose`);

apiRoutes.post('/register', auth.register.bind(auth));
apiRoutes.post('/login', auth.login.bind(auth));

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

apiRoutes.get('/email-verification/:URL', function(req, res) {
    emailVerification.verify(req, res);
});


module.exports = apiRoutes;