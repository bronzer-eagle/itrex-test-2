import _ from 'underscore';

class MessengerController {
    /** @ngInject */
    constructor($http, utilService) {
        this.utilService    = utilService;
        this.$http          = $http;

        this.init();
    }

    init() {
        this.getData();
    }

    getData() {
        this.$http(this._getHttpOptions())
            .then(res => {
                console.log(res);
            })
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('app/user-data'),
            method: 'GET'
        }
    }
}

const MessengerComponent = {
    template        : require('./messenger-component.template.html'),
    controller      : MessengerController
};

export default MessengerComponent;