import _ from 'underscore';
import './messenger-component.style.scss'

class MessengerController {
    /** @ngInject */
    constructor($http, utilService, $stateParams) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$stateParams   = $stateParams;
        this.message        = {};
        this.message.receivers = [];

        this.init();
    }

    init() {
        if (this.$stateParams.receiver) {
            this.message.receivers.push(this.$stateParams.receiver);
        }
    }

    sendMessage() {
        console.log(this.message);
        this.$http({
            url : this.utilService.apiPrefix('app/send-message'),
            method: 'POST',
            data: {message : this.message}
        })
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
    controller      : MessengerController,
    require         : {
        home        : '^homeComponent'
    }
};

export default MessengerComponent;