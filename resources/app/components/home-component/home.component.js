import _ from 'underscore';
import './home-component.style.scss'

class HomeController {
    /** @ngInject */
    constructor($http, utilService, $state) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$state         = $state;

        this.init();
    }

    init() {
        this.getData();
    }

    getData() {
        this.$http(this._getHttpOptions())
            .then(res => {
                this.user     = res.data.user;
                this.usersList = res.data.usersList;
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