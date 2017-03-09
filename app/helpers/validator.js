import _ from 'underscore';

class Validator {
    constructor(){
        this.types = {
            'registration' : {
                'email'     : 'email',
                'name'      : 'required',
                'password'  : 'required'
            },
            'login' : {
                'email'     : 'email',
                'password'  : 'required'
            }
        };
    }

    validate(obj, authType){
        return _.map(_.keys(this.types[authType]), item => {
            let
                val     = obj[item],
                type    = this.types[authType][item];

            return Validator[type](val, item);
        })
    }

    static required(val, key) {
        if (val) {
            return {flag: true}
        } else {
            return {
                flag    : false,
                message : `The ${key} field is required`
            }
        }
    }

    static email(val) {
        let
            re      = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            test    = re.test(val);

        if (test) {
            return {
                flag: true
            }
        } else {
            return {
                flag        : false,
                message     : 'The email is not valid!'
            }
        }
    }
}

export default new Validator();