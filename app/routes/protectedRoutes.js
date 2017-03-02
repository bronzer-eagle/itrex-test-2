/**
 * Created by alexander on 02.03.17.
 */
let
    express                 = require('express'),
    protectedRoutes         = express.Router(),
    multipart               = require('connect-multiparty'),
    userController          = require(`../controllers/userController`),
    homeController          = require(`../controllers/homeController`),
    restorePass             = require('../controllers/restorePasswordController');

protectedRoutes.get('/user-data',                       homeController.sendData.bind(homeController));
protectedRoutes.get('/get-messages',                    homeController.getMessages.bind(homeController));
protectedRoutes.get('/read-message',                    homeController.readMessage.bind(homeController));
protectedRoutes.post('/send-message',                   multipart({uploadDir: './storage' }), userController.sendMessage.bind(userController));
protectedRoutes.post('/change-password',                restorePass.setNewPassword.bind(restorePass));
protectedRoutes.post('/change-name',                    userController.changeName.bind(userController));
protectedRoutes.post('/change-email',                   userController.sendLinkToRestoreEmail.bind(userController));
protectedRoutes.post('/change-blacklist',               userController.changeBlacklist.bind(userController));

module.exports = protectedRoutes;