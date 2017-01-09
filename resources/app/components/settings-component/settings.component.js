import './settings-component.style.scss';

class SettingsController{
    /** @ngInject */
    constructor(utilService, $http, $timeout, alertService, $state) {
        this.utilService        = utilService;
        this.$http              = $http;
        this.$timeout           = $timeout;
        this.alertService       = alertService;
        this.$state             = $state;

        this.password           = {};
        this.inFlight           = false;

        this.$onInit     = this.init;
    }

    init() {
        this.blacklist = this.home.user.blacklist;
    }

    changeData(type) {
        this.inFlight = true;

        this.$http({
            url         : this.utilService.apiPrefix(`app/change-${type}`),
            method      : 'POST',
            data        : {
                [type]  : this[`${type}`]
            }
        }).then((resp) => {
            this.alertService.showSuccess(resp, () => {
                this.$state.go('home', {}, {reload: true});
            })
        }).catch((err) => {
            this.alertService.showError(err);
        }).finally(() => {
            this.inFlight = false;
        })
    }

    checkPassword() {
        if (this.password.confirm != this.password.new) {
            this.passwordForm.$invalid = true;
        }
    }
}

const
    SettingsComponent = {
        template        : require('./settings-component.template.html'),
        controller      : SettingsController,
        require         : {
            home        : '^homeComponent'
        }
    };

export default SettingsComponent;
