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
        this.pagination = {
            default: {
                start: 0,
                count: 5,
                moreAvailable: true
            }
        };
        this.messageType = 'sent';
        this.pagination.current = this.pagination.default;

        this.init();
    }

    init() {
        this.paginationService.getInfiniteData({
            url : this.utilService.apiPrefix('app/get-messages'),
            method: 'GET',
            params: {
                messageStatus: this.messageType
            }
        }, this.pagination).then(res=> {
            this.messages   = res.messages;
        })
    }

    changeMessageType(type) {
        this.messageType = type;
        this.pagination.current = this.pagination.default;
        this.init();
    }

    setText() {
        return this.messageType == 'sent' ? 'To: ' : 'From: '
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