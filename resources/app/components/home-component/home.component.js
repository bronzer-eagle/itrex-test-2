import _ from 'underscore';
import './home-component.style.scss'

class HomeController {
    /** @ngInject */
    constructor($http, utilService, $state, $timeout, jwtHelper) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;
        this.$timeout       = $timeout;
        this.inFlight       = false;

        let token = localStorage.getItem('token');
        let tokenPayload = jwtHelper.decodeToken(token);

        console.log(tokenPayload);

        this.init();

    }

    init() {
        this.getData();
    }

    getData() {
        this.inFlight = true;
        this.$http(this._getHttpOptions())
            .then(res => {
                this.user     = res.data.user;
                this.usersList = res.data.usersList;
                this.user.blacklist = _.filter(this.usersList, item => {
                    return this.user.blacklist.includes(item._id);
                });
                this.showAdminPanel();
                this.inFlight       = false;
            })
    }

    logout() {
        this.$http({
            url: this.utilService.apiPrefix('auth/logout'),
            method: 'GET'
        })
            .then(() => {
                localStorage.removeItem('token');
                this.$state.go('login')
            })
    }

    showAdminPanel() {
        this.$timeout(()=> {
            this.column = this.user.admin ? '2' : '3';
        })
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('app/user-data'),
            method: 'GET'
        }
    }
}

const HomeComponent = {
    template        : require('./home-component.template.html'),
    controller      : HomeController
};

export default HomeComponent;