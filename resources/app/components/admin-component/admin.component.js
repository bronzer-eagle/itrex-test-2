import './admin-component.style.sass';
import _ from 'underscore';

class AdminController {
    /** @ngInject */
    constructor(utilService, $http, $timeout) {
        this.utilService = utilService;
        this.$http       = $http;
        this.$timeout    = $timeout;
        this.password    = {};
        this.watchAsMeArr = [];
    }


}

const AdminComponent = {
    template    : require('./admin-component.template.html'),
    controller  : AdminController,
    require         : {
        home        : '^homeComponent'
    }
};

export default AdminComponent;
