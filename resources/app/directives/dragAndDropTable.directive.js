function dragAndDropTable() {
    return {
        restrict: 'E',
        scope: {
            keysToShow: '<',
            listFrom: '<',
            listTo  : '='
        },
        controller: function ($scope) {
            this.listFrom = [];
            this.listTo = [];

            this.listFrom.push(...$scope.listFrom);
            this.listTo.push(...$scope.listTo);

            this.col = Math.round(12 / $scope.keysToShow.length);

            this.dragToAnotherList = (i, list) => {
                let anotherList = list == 'From' ? 'To' : 'From';

                this[`list${anotherList}`].push(this[`list${list}`][i]);
                this[`list${list}`].splice(i, 1);
            }
        },
        controllerAs: '$ctrl',
        template: `
            <div class="row">
                <div class="col-xs-6">
                    <div class="user-row row" ng-repeat="item in $ctrl.listFrom" ng-click="$ctrl.dragToAnotherList($index, 'From')">
                        <div class="col-xs-{{$ctrl.col}}" ng-repeat="key in keysToShow">
                           {{item[key]}}
                        </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="user-row row" ng-repeat="item in $ctrl.listTo" ng-click="$ctrl.dragToAnotherList($index, 'To')">
                        <div class="col-xs-{{$ctrl.col}}" ng-repeat="key in keysToShow">
                            {{item[key]}}
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

export default dragAndDropTable;