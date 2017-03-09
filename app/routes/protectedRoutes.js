/**
 * Created by alexander on 02.03.17.
 */

import express        from 'express';
import multipart      from 'connect-multiparty';
import userController from '../controllers/userController';
import homeController from '../controllers/homeController';
import validation     from 'express-validation';
import rules          from '../validators/homePageValidator';
import restorePass    from '../controllers/restorePasswordController';

let protectedRoutes = express.Router;

protectedRoutes.get('/user-data',
    homeController.sendData.bind(homeController));

protectedRoutes.get('/get-messages',
    validation(rules.getMessages),
    homeController.getMessages.bind(homeController));

protectedRoutes.get('/read-message',
    validation(rules.readMessage),
    homeController.readMessage.bind(homeController));

protectedRoutes.post('/send-message',
    validation(rules.sendMessage),
    multipart({uploadDir: './storage' }), userController.sendMessage.bind(userController));

protectedRoutes.post('/change-password',
    restorePass.setNewPassword.bind(restorePass));

protectedRoutes.post('/change-name',
    validation(rules.changePassword),
    userController.changeName.bind(userController));

protectedRoutes.post('/change-email',
    validation(rules.changeEmail),
    userController.sendLinkToRestoreEmail.bind(userController));

protectedRoutes.post('/change-blacklist',
    validation(rules.changeBlacklist),
    userController.changeBlacklist.bind(userController));

export default protectedRoutes;