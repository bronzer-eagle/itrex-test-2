//form config from .env file
require('dotenv').config();

require('./app/database/database');
require('./app/config/passport');

let
    express                     = require(`express`),
    bodyParser                  = require(`body-parser`),
    path                        = require('path'),
    favicon                     = require('serve-favicon'),
    morgan                      = require('morgan'),
    passport                    = require('passport'),
    guard                       = require('express-jwt-permissions')(),
    authRoutes                  = require('./app/routes/authRoutes'),
    protectedRoutes             = require('./app/routes/protectedRoutes'),
    adminRoutes                 = require('./app/routes/adminRoutes'),
    jwt                         = require('express-jwt'),
    adminController             = require('./app/controllers/adminController'),
    app                         = express(),
    jwtCheck                    = jwt({secret: process.env.JWTSecret}),
    port                        = process.env.PORT || 8080;

/**
 * SETTING HEADERS
 */

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    next();
});

/**
 * SETTING DEV TOOLS
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

/**
 * SETTING STATIC PATHS
 */

app.use(express.static('./'));
app.use(express.static('./public'));

/**
 * SETTING ROUTES
 */

app.use('/auth', authRoutes);
app.use('/app', jwtCheck, protectedRoutes);
app.use('/admin', [jwtCheck, (req, res, next) => {
    if (req.method != 'OPTIONS') {
        next()
    } else {
        res.sendStatus(200);
    }
}, guard.check('admin')],  adminRoutes);

/**
 * OTHERWISE ROUTES
 */

app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

/**
 * RUN SERVER
 */

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});