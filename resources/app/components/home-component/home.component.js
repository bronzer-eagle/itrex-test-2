import _ from 'underscore';
import './home-component.style.scss'

class HomeController {
    /** @ngInject */
    constructor($http, utilService, $state, $timeout, jwtHelper, alertService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.$timeout       = $timeout;
        this.inFlight       = false;
        this.jwtHelper      = jwtHelper;
        this.alertService   = alertService;

        this.$onInit        = this.init;
    }

    init() {
        this.getData();
    }

    getData() {
        this.inFlight = true;
        this.$http(this._getHttpOptions())
            .then(res => {
                this.user           = res.data.user;
                this.usersList      = res.data.usersList;
                this.user.blacklist = _.filter(this.usersList, item => this.user.blacklist.includes(item._id));
                this.processJWT();
                this.showAdminPanel();
            })
            .catch(error => {
                this.alertService.showError(error);
            })
            .finally(() => {
                this.inFlight       = false;
            })
    }

    processJWT() {
        let
            token           = localStorage.getItem('token'),
            decodedToken    = this.jwtHelper.decodeToken(token);

        if (decodedToken.adminWatch){
            this.user.adminWatch = true;
        }
    }

    returnToAdmin() {
        let
            adminToken = localStorage.getItem('adminToken');

        localStorage.setItem('token', adminToken);

        this.$state.go('home', {}, {reload: true});
    }

    logout() {
        this.$http({
            url         : this.utilService.apiPrefix('auth/logout'),
            method      : 'GET'
        }).then(() => {
            localStorage.removeItem('token');
            this.$state.go('login')
        }).catch(error => {
            this.alertService.showError(error);
        })
    }

    closeMenu() {
        this.activeLeftSide = !this.activeLeftSide
    }

    showAdminPanel() {
        this.$timeout(()=> {
            this.col = this.user.admin ? '2' : '3';
        })
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('app/user-data'),
            method: 'GET'
        }
    }
}

const
    HomeComponent = {
    template        : require('./home-component.template.html'),
    controller      : HomeController
};

export default HomeComponent;