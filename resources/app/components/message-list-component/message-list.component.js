import _ from 'underscore';
import './message-list-component.style.scss'

class MessageListController {
    /** @ngInject */
    constructor($http, utilService, $stateParams, paginationService, $timeout) {
        this.utilService        = utilService;
        this.$http              = $http;
        this.$timeout           = $timeout;
        this.$stateParams       = $stateParams;
        this.paginationService  = paginationService;
        this.pagination         = paginationService.getPagination();
        this.$onInit            = this.init;
    }

    init() {
        this.messages           = {};
        this.messageType        = 'all';
        this.sortByDate         = 'ASC';
        this.sortByName         = null;
        this.searchByName       = null;

        this.getMessages();
    }

    getMessages(resetFlag) {
        if (resetFlag) this.pagination = this.paginationService.getPagination();

        if (!this.pagination.current.moreAvailable) return;

        let options = {
            messageType: this.messageType,
            sortByDate: this.sortByDate,
            sortByName: this.sortByName,
            searchByName: this.searchByName
        };

        this.paginationService.getInfiniteData({
            url : this.utilService.apiPrefix('app/get-messages'),
            method: 'GET',
            params: {
                options
            }
        }, this.pagination).then(res => {
                                                                                    console.log(res);
            this.messages   = res.messages;
        })
    }

    changeMessageType(type) {
        this.messageType = type;
        this.getMessages(true);
    }

    setText(message) {
        let userEmail = this.home.user.email;

        return message.sender.email == userEmail ? `To: ${message.receivers.toString()}` : `From: ${message.sender.email}`;
    }

    sortBy(sort) {
        let sortName;
        let type = sort.split('|')[1];

        if (type != 'null') {
            sortName = sort.split('|')[0];
        } else {
            type = null;
        }

        this[`sortBy${sortName}`] = type;

        this.getMessages(true);
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