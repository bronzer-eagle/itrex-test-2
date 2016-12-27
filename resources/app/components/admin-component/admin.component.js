import './admin-component.style.sass';
import _ from 'underscore';

class AdminController {
    /** @ngInject */
    constructor(utilService, $http, $timeout, $state) {
        this.utilService = utilService;
        this.$http       = $http;
        this.$timeout    = $timeout;
        this.password    = {};
        this.$state     = $state;

        this.$onInit = this.init;
    }

    init() {

    }

    chooseUser(user) {
        this.search      = '';
        this.chosenUser  = user.name;
        this.watchAsUser = user._id;
    }

    setWatchAsMe() {
        this.$http({
            url: this.utilService.apiPrefix('admin/set-watch-as-me'),
            method: 'POST',
            data: {
                userId      : this.watchAsUser
            }
        })
            .then(res => {
                this.processJWT(res.data.token);
            })
    }

    processJWT(token) {
        let adminToken = localStorage.getItem('token');

        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('token', token);

        this.$state.go('home', {}, {reload: true});
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
