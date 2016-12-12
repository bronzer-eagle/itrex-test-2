    require('dotenv').config();

let express                     = require(`express`),
    bodyParser                  = require(`body-parser`),
    path                        = require('path'),
    favicon                     = require('serve-favicon'),
    morgan                      = require('morgan'),
    cookieParser                = require('cookie-parser'),
    passport                    = require('passport'),
    [authRoutes, testRoutes, protectedRoutes, adminRoutes]    = require('./app/routes'),
    jwt                         = require('express-jwt'),
    app                         = express(),
    adminController             = require('./app/controllers/adminController');
    ;

    require('./app/database/database');
    require('./app/config/passport');

let     jwtCheck = jwt({
            secret: process.env.JWTSecret
        });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/app', jwtCheck, protectedRoutes);
app.use('/admin', jwtCheck, authorizationCheck, adminRoutes);

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + process.env.serverPort + '/api');
});

app.listen(process.env.serverPort || 8080, () => {
    console.log(`App listening on port: ${process.env.serverPort}`);
});

function authorizationCheck(req, res, next) {
    if (!req.user) {
        return res.sendStatus(401);
    } else {
        adminController.isAdmin(req.user, res, function () {
            next();
        });
    }
}