import './info-component.style.scss'

class InfoController {
    /** @ngInject */
    constructor($http, utilService, $state, $stateParams, alertService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.$stateParams   = $stateParams;
        this.alertService   = alertService;

        this.inFlight       = false;

        this.$onInit        = this.init;
    }

    init() {
        this.message    = this.$stateParams.message;
        this.type       = this.$stateParams.type;
        this.options    = this.$stateParams.options;
    }

    resendVerificationEmail() {
        this.inFlight = true;

        this.$http({
            url         : this.utilService.apiPrefix('auth/resend-verification'),
            method      : 'GET',
            params      : {
                email   : this.$stateParams.options.email
            }
        }).then(res => {
            this.message = res.data.message;
        }).catch(error => {
            this.alertService.showError(error);
        }).finally(()  => {
            this.inFlight       = false;
        })
    }
}

const InfoComponent = {
    template        : require('./info-component.template.html'),
    controller      : InfoController
};

export default InfoComponent;