import './auth-component-style.scss';

class AuthController {
    /** @ngInject */
    constructor($http, utilService) {
        this.utilService            = utilService;
        this.$http                  = $http;
        this.error                  = {};
        this.inFlight               = false;
    }
}

const AuthComponent = {
    template        : require('./auth-component.template.html'),
    controller      : AuthController
};

export default AuthComponent;