/**
 * Created by alexander on 02.03.17.
 */

module.exports = {
    emailVerification : model => { return {
        verificationURL         : `${process.env.appHttp}auth/email-verification?token=\${URL}`,
        persistentUserModel     : model,
        tempUserCollection      : 'tempusers',
        shouldSendConfirmation  : false,

        transportOptions        : {
            service             : 'Gmail',
            auth                : {
                user            : process.env.email,
                pass            : process.env.emailPass
            }
        },
        verifyMailOptions   : {
            from            : 'Mailer',
            subject         : 'Please confirm account',
            html            : '<p>Click the following link to confirm your account:</p>'+
            '<a href="${URL}">${URL}</a>',
            text            : 'Please confirm your account by clicking the following link: ${URL}'
        }
    }}
};