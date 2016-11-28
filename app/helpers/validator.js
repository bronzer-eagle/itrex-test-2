let _ = require('underscore');

class Validator {
    constructor(){
        this.types = {
            'registration' : {
                'email'     : 'email',
                'name'      : 'required',
                'password'  : 'required'
            }
        };
    }

    validate(obj, authType){
        return _.map(_.keys(this.types[authType]), item => {
            let val = obj[item];

            let type = this.types[authType][item];

            return this[type](val, item);
        })
    }

    required(val, key) {
        if (val) {
            return {
                flag: true
            }
        } else {
            return {
                flag    : false,
                message : `The ${key} field is required`
            }
        }
    }

    email(val) {
        let re      = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let flag    = re.test(val);

        if (flag) {
            return {
                flag: flag
            }
        } else {
            return {
                flag        : flag,
                message     : 'The email is not valid!'
            }
        }
    }
}

module.exports = new Validator();