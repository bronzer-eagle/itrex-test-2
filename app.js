    require('dotenv').config();

let
    jwtCheck,
    express                     = require(`express`),
    bodyParser                  = require(`body-parser`),
    path                        = require('path'),
    favicon                     = require('serve-favicon'),
    morgan                      = require('morgan'),
    passport                    = require('passport'),
    guard                       = require('express-jwt-permissions')(),
    [
        authRoutes,
        testRoutes,
        protectedRoutes,
        adminRoutes
    ]                           = require('./app/routes'),
    jwt                         = require('express-jwt'),
    app                         = express(),
    adminController             = require('./app/controllers/adminController');

    require('./app/database/database');
    require('./app/config/passport');

    jwtCheck = jwt({
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
app.use('/admin', [jwtCheck, (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method != 'OPTIONS') {
        next()
    } else {
        res.sendStatus(200);
    }
}, guard.check('admin')],  adminRoutes);

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + process.env.serverPort + '/api');
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port: ${process.env.PORT}`);
});
