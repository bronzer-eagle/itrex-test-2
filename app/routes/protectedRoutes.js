/**
 * Created by alexander on 02.03.17.
 */
let
    express                 = require('express'),
    protectedRoutes         = express.Router(),
    multipart               = require('connect-multiparty'),
    userController          = require(`../controllers/userController`),
    homeController          = require(`../controllers/homeController`),
    validation              = require('express-validation'),
    rules                   = require('../validators/homePageValidator'),
    restorePass             = require('../controllers/restorePasswordController');

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

module.exports = protectedRoutes;