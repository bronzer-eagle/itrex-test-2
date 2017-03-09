/**
 * Created by alexander on 02.03.17.
 */

export default {
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
    }},

    restorePassword : (email, token) => {
        return {
            to      : email,
            from    : 'Mailer',
            subject : 'Password reset',
            text    : `
                            You are receiving this because you (or someone else) have requested the reset of the password for your account.
                            Please click on the following link, or paste this into your browser to complete the process:
                            ${process.env.appHttp}auth/restore-password?token=${token} If you did not request this, please ignore this email and your password will remain unchanged.`,
            html    : `
                            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
                            Please click on the following link, or paste this into your browser to complete the process:</p>
                            <a href="${process.env.appHttp}auth/restore-password?token=${token}">${process.env.appHttp}auth/restore-password?token=${token}</a>
                            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        }
    },

    restoreEmail : (email, token) => {
        return {
            to      : email,
            from    : 'Mailer',
            subject : 'Email Reset',
            text    :
                `You are receiving this because you (or someone else) have requested the reset of the email for your account.
                        Please click on the following link, or paste this into your browser to complete the process:
                        ${process.env.appHttp}auth/email-verification?token=${token}&notNewUser=true 
                        If you did not request this, please ignore this email and your password will remain unchanged.`,
            html    :
                `<p>You are receiving this because you (or someone else) have requested the reset of the email for your account.
                        Please click on the following link, or paste this into your browser to complete the process:</p>
                        <a href='${process.env.appHttp}auth/email-verification?token=${token}&notNewUser=true'>
                        ${process.env.appHttp}auth/email-verification?token=${token}&notNewUser=true</a> 
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        }
    },
    nodemailer : {
        host            : 'smtp.gmail.com',
        port            : 465,
        secure          : true,
        auth            : {
            user        : process.env.email,
            pass        : process.env.emailPass
        }
    }
};