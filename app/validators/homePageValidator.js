/**
 * Created by alexander on 05.03.17.
 */
let Joi = require('joi');

module.exports = {
    'getMessages' : {
        query: {
            pagination   : Joi.object().keys({
                start           : Joi.number(),
                count           : Joi.number(),
                moreAvailable   : Joi.boolean()
            })
        }
    },
    'readMessage' : {
        query: {
            message_id  : Joi.alternatives().try(Joi.number(), Joi.string())
        }
    },
    'sendMessage' : {
        body: {
            message   : Joi.object().keys({
                receivers : Joi.array().items(
                    Joi.object().keys({
                        email : Joi.string().email().required()
                    })
                ),
                message : Joi.object().required()
            })
        }
    },
    'changePassword' : {
        body: {
            password: Joi.string().required()
        }
    },
    'changeEmail' : {
        body: {
            email   : Joi.string().email().required()
        }
    },
    'changeBlacklist' : {
        body : {
            blacklist : Joi.array()
        }
    }
};