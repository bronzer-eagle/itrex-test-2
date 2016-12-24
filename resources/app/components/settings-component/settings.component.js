import './settings-component.style.scss';
import _ from 'underscore';

class SettingsController{
    /** @ngInject */
    constructor(utilService, $http, $timeout) {
        this.utilService = utilService;
        this.$http       = $http;
        this.$timeout    = $timeout;
        this.password    = {};

        this.init();
    }

    init() {

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

    changeEmail() {
        this.$http({
            url: this.utilService.apiPrefix('app/change-email'),
            method: 'POST',
            data: {
                newEmail : this.email
            }
        })
    }

    setBlacklist() {
        this.$http({
            url: this.utilService.apiPrefix('app/set-blacklist'),
            method: 'POST',
            data: {
                blacklist : this.home.user.blacklist
            }
        })
    }
}

const SettingsComponent = {
    template    : require('./settings-component.template.html'),
    controller  : SettingsController,
    require         : {
        home        : '^homeComponent'
    }
};

export default SettingsComponent;
