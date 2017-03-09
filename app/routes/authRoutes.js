/**
 * Created by alexander on 02.03.17.
 */
import express            from 'express';
import emailVerification  from '../controllers/emailVerification';
import auth               from '../controllers/auth.js';
import userController     from '../controllers/userController';
import validate           from 'express-validation';
import rules              from '../validators/authValidator';
import restorePass        from '../controllers/restorePasswordController';

let authRoutes = express.Router();

authRoutes.post('/register',
    validate(rules.register),
    auth.register.bind(auth));

authRoutes.post('/login',
    validate(rules.login),
    auth.login.bind(auth));

authRoutes.post('/forgot-password',
    validate(rules.forgotPassword),
    restorePass.sendLink.bind(restorePass));

authRoutes.post('/restore-user-password',
    validate(rules.restorePassword),
    restorePass.restore.bind(restorePass));

authRoutes.get('/resend-verification',
    validate(rules.resendEmailLink),
    emailVerification.resendVerification.bind(emailVerification));

authRoutes.get('/logout', (req, res) => {
    req.logout();
    res.status(200);
    res.json({});
});

authRoutes.post('/email-confirmation', (req, res) => {
    if (req.body.notNewUser) {
        userController.changeEmail(req, res);
    } else {
        emailVerification.verify(req, res);
    }
});

export default authRoutes;