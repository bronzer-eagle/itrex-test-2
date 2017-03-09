/**
 * Created by alexander on 05.03.17.
 */
import Joi from 'joi';

export default {
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