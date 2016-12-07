import _ from 'underscore';

class LoginController {
    /** @ngInject */
    constructor($http, $state, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
    }

    signIn() {
        this.$http(this._getHttpOptions(this.signInData))
            .then(res => {
                let token = res.data.token;

                if (token) this.processToken(token);

                console.log(res);
            })
            .catch(err => {
                throw new Error(err); //TODO: set processError service
            })
            .finally(() => {
                console.log('Request to server');
            })
    }

    processToken(token) {
        localStorage.setItem('token', token);

        this.$state.go('home');
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('auth/login'),
            skipAuthorization: true,
            method: 'POST',
            data: data
        }
    }
}

const LoginComponent = {
    template        : require('./login-component.template.html'),
    controller      : LoginController
};

export default LoginComponent;