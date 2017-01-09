import './messenger-component.style.scss'

class MessengerController {
    /** @ngInject */
    constructor($state, $http, utilService, $stateParams, Upload, alertService) {
        this.utilService        = utilService;
        this.$http              = $http;
        this.upload             = Upload;
        this.$stateParams       = $stateParams;
        this.$state             = $state;

        this.inFlight           = false;
        this.alertService       = alertService;
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
        this.inFlight = true;

        this.upload.upload({
            url         : this.utilService.apiPrefix('app/send-message'),
            data        : {file: this.file, message : this.message}
        }).then((resp) => {
            this.alertService.showSuccess(resp, ()=>{
                this.$state.go('home', {}, {reload: true});
            })
        }).catch((err) => {
            this.alertService.showError(err);
        }).finally(() => {
            this.inFlight = false;
        })
    }

    checkFileSize() {
        if (this.messengerForm.file.$error.maxSize) {
            this.alertService.showError({
                status      : 400,
                data        : {
                    message : 'File cannot be more than 5MB'
                }
            });
        }
    }
}

const
    MessengerComponent = {
        template        : require('./messenger-component.template.html'),
        controller      : MessengerController,
        require         : {
            home        : '^homeComponent'
        }
    };

export default MessengerComponent;