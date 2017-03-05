/**
 * Created by alexander on 05.03.17.
 */

/**
 * Created by alexander on 05.03.17.
 */
let Joi = require('joi');

module.exports = {
    'watchAsMe' : {
        body: {
            userId : Joi.alternatives().try(Joi.number(), Joi.string())
        }
    },
    'changeAdmins' : {
        body: {
            admins   : Joi.array()
        }
    }
};