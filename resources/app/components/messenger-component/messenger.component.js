import _ from 'underscore';
import './messenger-component.style.scss'

class MessengerController {
    /** @ngInject */
    constructor($http, utilService, $stateParams, Upload) {
        this.utilService    = utilService;
        this.$http          = $http;
        this.upload         = Upload;
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
        this.upload.upload({
            url : this.utilService.apiPrefix('app/send-message'),
            data: {file: this.file, message : this.message}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

        // this.$http({
        //     url : this.utilService.apiPrefix('app/send-message'),
        //     method: 'POST',
        //     data: {message : this.message}
        // })
        //     .then(res => {
        //         console.log(res);
        //     })
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