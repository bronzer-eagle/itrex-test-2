import './settings-component.style.scss'

class SettingsController{
    /** @ngInject */
    constructor(UtilService, $http) {
        this.utilService = UtilService;
        this.$http       = $http;
        this.password    = {};
    }

    changePassword() {
        this.$http({
            url: this.utilService.apiPrefix('app/change-password'),
            method: 'POST',
            data: this.password
        })
    }

    checkPassword() {
        if (this.password.confirm != this.password.new) {
            this.passwordForm.$invalid = true;
        }
    }
}

const SettingsComponent = {
    template    : require('./settings-component.template.html'),
    controller  : SettingsController
};

export default SettingsComponent;
