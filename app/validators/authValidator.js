/**
 * Created by alexander on 05.03.17.
 */
let Joi = require('joi');

module.exports = {
    'login' : {
        body: {
            email   : Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    'register' : {
        body: {
            name    : Joi.string().required(),
            email   : Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    'forgotPassword' : {
        body: {
            email   : Joi.string().email().required()
        }
    },
    'restorePassword' : {
        body: {
            password: Joi.string().required()
        }
    },
    'resendEmailLink' : {
        query: {
            email   : Joi.string().email().required()
        }
    }
};