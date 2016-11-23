let config      = require(`./configs/app-config`),
    express     = require(`express`),
    bodyParser  = require(`body-parser`),
    app         = express()

    ;

app.listen(config.port, () => {
    console.log(`App listening on port: ${config.port}`);
});