/**
 * Created by alexander on 02.03.17.
 */
let
    express                 = require('express'),
    adminRoutes             = express.Router(),
    adminController          = require(`../controllers/adminController`);

adminRoutes.post('/set-watch-as-me',                    adminController.setWatchAsMe.bind(adminController));
adminRoutes.post('/set-admins',                         adminController.changeAdmins.bind(adminController));

module.exports = adminRoutes;