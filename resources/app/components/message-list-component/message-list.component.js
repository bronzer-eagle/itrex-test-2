import _ from 'underscore';
import './message-list-component.style.scss'

class MessageListController {
    /** @ngInject */
    constructor($http, utilService, $stateParams, paginationService, $timeout, $sce, $rootScope, alertService) {
        this.utilService        = utilService;
        this.$http              = $http;
        this.$timeout           = $timeout;
        this.$stateParams       = $stateParams;
        this.paginationService  = paginationService;
        this.pagination         = paginationService.getPagination();
        this.$sce               = $sce;
        this.inFlight           = false;
        this.$rootScope         = $rootScope;
        this.alertService       = alertService;
        this.$onInit            = this.init;
    }

    init() {
        this.messages           = [];
        this.messageType        = 'all';
        this.sortByDate         = 'DESC';
        this.sortByName         = null;
        this.searchByName       = null;
        this.sortByNameValue    = 'Name';
    }

    getMessages(resetFlag) {
        if (resetFlag) {
            this.messages   = [];
            this.pagination = this.paginationService.getPagination();
        }

        if (!this.pagination.current.moreAvailable) return;

        let options = {
            messageType: this.messageType,
            sortByDate: this.sortByDate,
            sortByName: this.sortByName,
            searchByName: this.searchByName
        };

        this.inFlight = true;

        this.paginationService.getInfiniteData({
            url : this.utilService.apiPrefix('app/get-messages'),
            method: 'GET',
            params: {
                options
            }
        }, this.pagination)
            .then(res => {
                this.messages.push(...res.messages);
                this.$rootScope.$emit('checkingScroll');
            })
            .catch(error => {
                this.alertService.showError(error);
            })
            .finally(()=>{
                this.inFlight = false;
            })
    }

    changeMessageType(type) {
        this.messageType = type;
        this.getMessages(true);
    }

    setText(message) {
        let userEmail = this.home.user.email;

        if (userEmail) {
            let receivers = _.map(message.receivers, item => {return item.receiver.name});

            if (message.sender.email == userEmail) {
                message.status = true;
                return `To: ${receivers.toString()}`
            } else {
                let receiver    = _.filter(message.receivers, item => {return item.receiver.email == userEmail});

                message.status  = receiver[0].is_read;

                return `From: ${message.sender.name}`
            }
        }
    }

    sortBy(sort) {
        let sortName;
        let type = sort.split('|')[1];

        sortName = sort.split('|')[0];

        if (type == 'null') {
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
            let
                receiver            = _.filter(message.receivers, item => {return item.receiver.email == userEmail});
                receiver[0].is_read = true;
        }).catch(err => {
            this.alertService.showError(err);
        });
    }

    bindHtml(text) {
        return this.$sce.trustAsHtml(text);
    }

    getMessageReceivers(receivers) {
        let receiverArr = _.map(receivers, item => `${item.receiver.name} <span class="text-muted">${item.receiver.email}</span>`);

        return this.$sce.trustAsHtml(receiverArr.join(', '));
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