class RegisterController {
    /** @ngInject */
    constructor($http, $state, utilService, alertService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.alertService   = alertService;
    }

    signUp() {
        this.auth.inFlight = true;

        this.$http(this._getHttpOptions(this.signUpData))
            .then(res => {
                this.$state.go('info', {
                    message     : res.data.message,
                    type        : 'email-verification',
                    options     : {
                        email   : this.signUpData.email
                    }
                });
            })
            .catch(err => {
                this.alertService.showError(err);
            })
            .finally(() => {
                this.auth.inFlight = false;
            })
    }

    _getHttpOptions(data) {
        return {
            url         : this.utilService.apiPrefix('auth/register'),
            method      : 'POST',
            data        : data
        }
    }
}

const
    RegisterComponent = {
        template            : require('./register-component.template.html'),
        controller          : RegisterController,
        require             : {
            auth            : '^authComponent'
        }
    };

export default RegisterComponent;