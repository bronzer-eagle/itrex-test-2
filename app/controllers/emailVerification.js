require('../database/models/users');

let mongoose = require('mongoose'),
    User = mongoose('User'),
    nev = require('email-verification')(mongoose);

nev.configure({
    verificationURL: `http://localhost:8080/email-verification/\${URL}`,
    persistentUserModel: User,
    tempUserCollection: 'tempusers',

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'bronzer2010@gmail.com',
            pass: 'uS4foultY'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    }
}, function(error, options){
    console.log(error)
});

// generating the model, pass the User model defined earlier
nev.generateTempUserModel(User);

// using a predefined file
nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});