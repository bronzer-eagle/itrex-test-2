import './admin-component.style.sass';
import _ from 'underscore';

class AdminController {
    /** @ngInject */
    constructor(utilService, $http, $timeout) {
        this.utilService = utilService;
        this.$http       = $http;
        this.$timeout    = $timeout;
        this.password    = {};

        this.$onInit = this.init;
    }

    init() {
        this.watchAsMeArr = _.filter(this.home.usersList, item => this.home.user.watchAsMe.includes(item._id));
        this.usersList    = _.filter(this.home.usersList, item => !this.home.user.watchAsMe.includes(item._id));
    }

    setWatchAsMe() {
        console.log(this.watchAsMeArr);
        this.$http({
            url: this.utilService.apiPrefix('admin/set-watch-as-me'),
            method: 'POST',
            data: {
                userId      : this.home.user._id,
                watchAsMeArr: _.map(this.watchAsMeArr, item => item._id)
            }
        })
            .then(res => {
                console.log(res);
            })
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
