let express     = require('express'),
    apiRoutes   = express.Router();
    auth        = require('./controllers/auth');

const mongoose = require(`mongoose`);

apiRoutes.post('/register', auth.register.bind(auth));
apiRoutes.post('/login', auth.login.bind(auth));

apiRoutes.get('/users', function (req, res) {
    mongoose.model('User').find({}, (err, users) => {
        res.json(users);
    })
});


module.exports = apiRoutes;