import './settings-component.style.scss'

class SettingsController{
    /** @ngInject */
    constructor(utilService, $http) {
        this.utilService = utilService;
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

    changeName() {
        this.$http({
            url: this.utilService.apiPrefix('app/change-name'),
            method: 'POST',
            data: {
                name : this.name
            }
        })
    }
}

const SettingsComponent = {
    template    : require('./settings-component.template.html'),
    controller  : SettingsController
};

export default SettingsComponent;
