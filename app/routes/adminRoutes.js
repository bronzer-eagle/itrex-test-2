/**
 * Created by alexander on 02.03.17.
 */
let
    express                 = require('express'),
    adminRoutes             = express.Router(),
    validate                = require('express-validation'),
    rules                   = require('../validators/adminPageValidator'),
    adminController          = require(`../controllers/adminController`);

adminRoutes.post('/set-watch-as-me',
    validate(rules.watchAsMe),
    adminController.setWatchAsMe.bind(adminController));

adminRoutes.post('/set-admins',
    validate(rules.changeAdmins),
    adminController.changeAdmins.bind(adminController));

module.exports = adminRoutes;