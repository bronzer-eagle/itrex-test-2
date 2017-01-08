function dragAndDropTable() {
    return {
        restrict: 'E',
        scope: {
            keysToShow: '<',
            listFrom: '<',
            listTo  : '='
        },
        controller: function ($scope) {
            this.listFrom   = [];
            this.col        = Math.round(12 / $scope.keysToShow.length);

            this.listFrom.push(...$scope.listFrom);

            this.dragToAnotherList = (i, list) => {
                let anotherList = `list${list == 'From' ? 'To' : 'From'}`,
                    listName    = `list${list}`,
                    listOne     = this[anotherList] ? this[anotherList] : $scope[anotherList],
                    listTwo     = this[listName] ? this[listName] : $scope[listName];

                listOne.push(listTwo[i]);
                listTwo.splice(i, 1);
            }
        },
        controllerAs: '$ctrl',
        template: `
            <div class="row drag-end-drop">
                <div class="col-xs-6 section">
                    <div class="user-row row" ng-repeat="item in $ctrl.listFrom" ng-click="$ctrl.dragToAnotherList($index, 'From')">
                        <div class="col-xs-{{$ctrl.col}}" ng-repeat="key in keysToShow">
                           <div class="ellipsis">
                                {{item[key]}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-6 section">
                    <div class="user-row row" ng-repeat="item in listTo" ng-click="$ctrl.dragToAnotherList($index, 'To')">
                        <div class="col-xs-{{$ctrl.col}}" ng-repeat="key in keysToShow">
                            <div class="ellipsis">
                                {{item[key]}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

export default dragAndDropTable;