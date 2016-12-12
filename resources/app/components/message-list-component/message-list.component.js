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
        this.sortByDate = 'ASC';
        this.sortByName = null;
        this.pagination.current = this.pagination.default;

        this.init();
    }

    init() {
        this.paginationService.getInfiniteData({
            url : this.utilService.apiPrefix('app/get-messages'),
            method: 'GET',
            params: {
                messageType: this.messageType,
                sortByDate: this.sortByDate,
                sortByName: this.sortByName
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

    searchInMessages() {
        this.pagination.current = this.pagination.default;

        this.paginationService.getInfiniteData({
            url : this.utilService.apiPrefix('app/search-messages'),
            method: 'GET',
            params: {
                searchName: this.searchName
            }
        }, this.pagination).then(res=> {
            this.messages   = res.messages;
        })
    }

    setText(message) {
        return this.messageType == 'sent' ? `To: ${message.receivers.toString()}` : `From: ${message.sender}`;
    }

    sortBy(sort) {
        let sortName = sort.split('|')[0];

        this[`sortBy${sortName}`] = sort.split('|')[1];
        this.pagination.current = this.pagination.default;

        this.init();
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