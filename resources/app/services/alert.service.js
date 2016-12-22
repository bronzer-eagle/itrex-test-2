class AlertService {
    /** @ngInject */
    constructor($uibModal) {
        this.$uibModal           = $uibModal;
    }

    showError(err) {
        this.$uibModal.open({
            controller          : function($uibModalInstance){
                this.error      = err;
                this.closePopup = function () {
                    this.error  = {};

                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs        : '$ctrl',
            template            : require('../templates/error-alert.template.html')
        })
    }
}

export default AlertService;