import './app/database/database';
import './app/config/passport';

import express         from 'express';
import bodyParser      from 'body-parser';
import morgan          from 'morgan';
import passport        from 'passport';
import guard           from 'express-jwt-permissions';
import authRoutes      from './app/routes/authRoutes';
import protectedRoutes from './app/routes/protectedRoutes';
import adminRoutes     from './app/routes/adminRoutes';
import jwt             from 'express-jwt';
import helper          from './app/helpers/expressHelpers';

let app      = express(),
    jwtCheck = jwt({secret: process.env.JWTSecret}),
    port     = process.env.PORT || 8080;

/**
 * SETTING HEADERS
 */

app.use((req, res, next) => {
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
 * OTHER OPTIONS
 */

app.use((req, res, next) => {
    res.success = helper.success;
    res.error = helper.error;

    next();
});

/**
 * SETTING ROUTES
 */

app.use('/auth', authRoutes);
app.use('/app', jwtCheck, protectedRoutes);
app.use('/admin', [jwtCheck, (req, res, next) => {
    if (req.method != 'OPTIONS') {
        next()
    } else {
        helper.success(200, {}, res);
    }
}, guard.check('admin')],  adminRoutes);

/**
 * OTHERWISE ROUTES
 */

app.use((req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

/**
 * RUN SERVER
 */

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});