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
        this.chosenUser = {};

        this.$onInit = this.init;
    }

    init() {
        this.newAdmins  = _.filter(this.home.usersList, item => item.admin);
        this.usersList  = _.filter(this.home.usersList, item => !item.admin);
    }

    setWatchAsMe() {
        this.$http({
            url: this.utilService.apiPrefix('admin/set-watch-as-me'),
            method: 'POST',
            data: {
                userId      : this.chosenUser._id
            }
        })
        .then(res => {
            this.processJWT(res.data.token);
        })
    }

    setNewAdmins() {
        this.$http({
            url: this.utilService.apiPrefix('admin/set-admins'),
            method: 'POST',
            data: {
                admins      : _.map(this.newAdmins, item => item._id)
            }
        })
            .then(res => {
                console.log(res);
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
