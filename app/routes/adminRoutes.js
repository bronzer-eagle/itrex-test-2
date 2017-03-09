/**
 * Created by alexander on 02.03.17.
 */

import express          from 'express';
import validate         from 'express-validation';
import rules            from '../validators/adminPageValidator';
import adminController  from '../controllers/adminController';

const adminRoutes = express.Router;

adminRoutes.post('/set-watch-as-me',
    validate(rules.watchAsMe),
    adminController.setWatchAsMe.bind(adminController));

adminRoutes.post('/set-admins',
    validate(rules.changeAdmins),
    adminController.changeAdmins.bind(adminController));

export default adminRoutes;