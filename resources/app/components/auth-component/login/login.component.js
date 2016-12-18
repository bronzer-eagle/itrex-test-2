class LoginController {
    /** @ngInject */
    constructor($http, $state, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.inFlight       = false;
    }

    signIn() {
        this.inFlight = true;

        this.$http(this._getHttpOptions(this.signInData))
            .then(res => {
                let token = res.data.token;

                if (token) this.processToken(token);

                console.log(res);
            })
            .catch(err => {
                this.auth.showError(err);
            })
            .finally(() => {
                this.inFlight = false;
            })
    }

    restorePassword() {
        this.inFlight = true;

        this.$http({
            url: this.utilService.apiPrefix('auth/forgot-password'),
            method: 'POST',
            skipAuthorization: true,
            data: {
                email: this.emailForRestore
            }
        })
            .then(res => {
                this.$state.go('info', {
                    msg: res.data.message,
                    type: 'restore',
                });
            })
            .catch(err => {
                this.auth.showError(err);
            })
            .finally(() => {
                this.inFlight = false;
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
    controller      : LoginController,
    require         : {
        auth        : '^authComponent'
    }
};

export default LoginComponent;