import _ from 'underscore';

class RegisterController {
    /** @ngInject */
    constructor($http, $state, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
    }

    signUp() {
        this.$http(this._getHttpOptions(this.signUpData))
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                throw new Error(err); //TODO: set processError service
            })
            .finally(() => {
                console.log('Request to server');
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