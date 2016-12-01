let config              = require(`./configs/app-config`),
    express             = require(`express`),
    bodyParser          = require(`body-parser`),
    path                = require('path'),
    favicon             = require('serve-favicon'),
    morgan              = require('morgan'),
    cookieParser        = require('cookie-parser'),
    passport            = require('passport'),
    apiRoutes           = require('./app/routes'),

    app                 = express()
    ;

    require('./app/database/database');
    require('./app/config/passport');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/auth', apiRoutes);

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + config.port + '/api');
});

app.listen(config.port, () => {
    console.log(`App listening on port: ${config.port}`);
});