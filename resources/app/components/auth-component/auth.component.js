import './auth-component-style.scss';
import _ from 'underscore';

class AuthController {
    /** @ngInject */
    constructor($http, utilService, $uibModal) {
        this.utilService            = utilService;
        this.$uibModal              = $uibModal;
        this.$http                  = $http;
        this.error                  = {};
    }

    showError(err) {
        this.error = err;
        this.$uibModal.open({
            controller      : function($uibModalInstance){
                this.closePopup = function () {
                    this.error  = {};
                    $uibModalInstance.dismiss('cancel');
                };
                this.error      = err;
            },
            controllerAs    : '$ctrl',
            template        : require('../../templates/error-popup.template.html')
        })
    }
}

const AuthComponent = {
    template        : require('./auth-component.template.html'),
    controller      : AuthController
};

export default AuthComponent;