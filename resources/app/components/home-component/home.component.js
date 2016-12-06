import _ from 'underscore';

class HomeController {
    /** @ngInject */
    constructor($http, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;

        //this.init();
    }

    $init() {
        console.log('init');
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('auth/login'),
            method: 'POST',
            data: data
        }
    }
}

const HomeComponent = {
    template        : require('./home-component.template.html'),
    controller      : HomeController
};

export default HomeComponent;