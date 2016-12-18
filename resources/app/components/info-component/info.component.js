import _ from 'underscore';
import './info-component.style.scss'

class InfoController {
    /** @ngInject */
    constructor($http, utilService, $state, $stateParams) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.$stateParams   = $stateParams;

        this.init();
    }

    init() {
        this.message = this.$stateParams.msg;
        this.type = this.$stateParams.type;
        this.options = this.$stateParams.options;
    }

    resendVerificationEmail() {
        this.$http({
            url: this.utilService.apiPrefix('auth/resend-verification'),
            method: 'GET',
            params: {
                email: this.$stateParams.options.email
            }
        }).then(res => {
            this.message = res.data.msg;
        })
    }
}

const InfoComponent = {
    template        : require('./info-component.template.html'),
    controller      : InfoController
};

export default InfoComponent;