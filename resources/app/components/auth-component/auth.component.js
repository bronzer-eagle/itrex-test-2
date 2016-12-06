import _ from 'underscore';

class AuthController {
    /** @ngInject */
    constructor($http, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;
    }
}

const AuthComponent = {
    template        : require('./auth-component.template.html'),
    controller      : AuthController
};

export default AuthComponent;