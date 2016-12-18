import _ from 'underscore';

class RegisterController {
    /** @ngInject */
    constructor($http, $state, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.inFlight       = false;
    }

    signUp() {
        this.inFlight = true;

        this.$http(this._getHttpOptions(this.signUpData))
            .then(res => {
                this.$state.go('info', {
                    msg: res.data.msg,
                    type: 'email-verification',
                    options : {
                        email: this.signUpData.email
                    }
                });
            })
            .catch(err => {
                throw new Error(err); //TODO: set processError service
            })
            .finally(() => {
                this.inFlight = false;
            })
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('auth/register'),
            method: 'POST',
            data: data
        }
    }
}

const RegisterComponent = {
    template        : require('./register-component.template.html'),
    controller      : RegisterController
};

export default RegisterComponent;