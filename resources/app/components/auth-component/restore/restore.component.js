class RestoreController {
    /** @ngInject */
    constructor($http, $state, utilService, $location) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.inFlight       = false;
        this.$location      = $location;
        this.$onInit        = this.init();
    }

    init() {
        this.token = this.$location.search().token;
    }

    changePassword() {
        this.inFlight       = true;

        this.$http({
            url: this.utilService.apiPrefix('auth/restore-user-password'),
            method: 'POST',
            skipAuthorization: true,
            data: {
                password : this.restore.newPassword,
                token    : this.token
            }})
            .then(res => {
                console.log(res);
                this.$state.go('info', {
                    message: res.data.message,
                    type: 'restore',
                    options: {
                        success: true
                    }
                });
            })
            .catch(err => {
                this.auth.showError(err)
            })
            .finally(()=>{
                this.inFlight       = false;
            })
    }

    checkPassword() {
        this.restorePasswordForm.$invalid = (this.restore.newPassword != this.restore.confirmPassword);
    }
}

const RestoreComponent = {
    template        : require('./restore-component.template.html'),
    controller      : RestoreController,
    require         : {
        auth        : '^authComponent'
    }
};

export default RestoreComponent;