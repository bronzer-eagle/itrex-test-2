class LoginController {
    /** @ngInject */
    constructor($http, $state, utilService, alertService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.alertService   = alertService;
    }

    signIn() {
        let
            options        = this._getHttpOptions('auth/login', this.signInData);

        this.auth.inFlight = false;

        this.$http(options)
            .then(res => {
                if (res.data.token) this.processToken(res.data.token);
            })
            .catch(err => {
                this.alertService.showError(err);
            })
            .finally(() => {
                this.auth.inFlight = false;
            })
    }

    restorePassword() {
        let
            options = this._getHttpOptions('auth/forgot-password', {email : this.emailForRestore});

        this.auth.inFlight  = true;

        this.$http(options)
            .then(res => {
                this.$state.go('info', {
                    message : res.data.message,
                    type    : 'restore',
                });
            })
            .catch(err => {
                this.alertService.showError(err);
            })
            .finally(() => {
                this.auth.inFlight = false;
            })
    }

    processToken(token) {
        localStorage.setItem('token', token);

        this.$state.go('home');
    }

    _getHttpOptions(url, data) {
        return {
            url                 : this.utilService.apiPrefix(url),
            skipAuthorization   : true,
            method              : 'POST',
            data                : data
        }
    }
}

const
    LoginComponent = {
        template        : require('./login-component.template.html'),
        controller      : LoginController,
        require         : {
            auth        : '^authComponent'
        }
    };

export default LoginComponent;