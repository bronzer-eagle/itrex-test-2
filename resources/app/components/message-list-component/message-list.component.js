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
        this.sortByDate         = 'DESC';
        this.sortByName         = null;
        this.searchByName       = null;
        this.sortByNameValue    = 'Name';

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
            this.messages   = res.messages;
        })
    }

    changeMessageType(type) {
        this.messageType = type;
        this.getMessages(true);
    }

    setText(message) {
        let userEmail = this.home.user.email;
        let receivers = _.map(message.receivers, item => {return item.email});

        if (message.sender.email == userEmail) {
            message.status = true;
            return `To: ${receivers.toString()}`
        } else {
            message.status = _.findWhere(message.receivers, {email : userEmail}).is_read;

            return `From: ${message.sender.email}`
        }
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

    readMessage(message) {
        if (message.status) return;

        let userEmail = this.home.user.email;

        this.$http({
            url     : this.utilService.apiPrefix('app/read-message'),
            method  : 'GET',
            params: {
                message_id: message._id
            }
        }).then(() => {
            let obj = _.findWhere(message.receivers, {email : userEmail});
            obj.is_read = true;
        }).catch(err => {
            console.log(err);
        });
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