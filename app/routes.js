let express     = require('express'),
    apiRoutes   = express.Router();
    auth        = require('./controllers/auth');

apiRoutes.post('/register', auth.register.bind(auth));
apiRoutes.post('/login', auth.login.bind(auth));

module.exports = apiRoutes;