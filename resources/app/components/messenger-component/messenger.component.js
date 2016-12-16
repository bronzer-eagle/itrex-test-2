import _ from 'underscore';
import './messenger-component.style.scss'

class MessengerController {
    /** @ngInject */
    constructor($http, utilService, $stateParams, Upload) {
        this.utilService        = utilService;
        this.$http              = $http;
        this.upload             = Upload;
        this.$stateParams       = $stateParams;
        this.message            = {
            receivers           : []
        };

        this.init();
    }

    init() {
        if (this.$stateParams.receiver) {
            this.message.receivers.push(this.$stateParams.receiver);
        }
    }

    sendMessage() {
        this.upload.upload({
            url : this.utilService.apiPrefix('app/send-message'),
            data: {file: this.file, message : this.message}
        }).then(function (resp) {
            console.log(resp);
        }, function (err) {
            console.log('Error status: ' + err.status);
            console.log(err)
        });
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