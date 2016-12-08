import _ from 'underscore';
import './message-list-component.style.scss'

class MessageListController {
    /** @ngInject */
    constructor($http, utilService, $stateParams, paginationService) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.$stateParams   = $stateParams;
        this.messages        = {};
        this.paginationService  = paginationService;

        this.init();
    }

    init() {
        this.paginationService.getInfiniteData({
            url : this.utilService.apiPrefix('app/get-messages'),
            method: 'GET',
            params: {
                pagination: {
                    start: 0,
                    count: 5,
                    moreAvailable: true
                }
            }
        }, {
            start: 0,
            count: 5,
            moreAvailable: true
        }).then(res=> {
            this.res = res.messages;
        })
    }

    _getHttpOptions(data) {
        return {
            url : this.utilService.apiPrefix('app/user-data'),
            method: 'GET'
        }
    }
}

const MessageListComponent = {
    template        : require('./message-list-component.template.html'),
    controller      : MessageListController,
    require         : {
        home        : '^homeComponent'
    }
};

export default MessageListComponent;