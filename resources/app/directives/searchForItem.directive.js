function searchForItem() {
    return {
        restrict            : 'E',
        scope               : {
            list            : '=',
            resource        : '=',
            keyToDisplay    : '@',
            unique          : '<',
            max             : '='
        },
        controller          : function ($scope) {
            this.ownResource    = [];
            this.addMode        = false;

            this.ownResource.push(..._.difference($scope.resource, $scope.list));

            if (!$scope.max) $scope.max = this.ownResource.length;

            this.addToObject = (obj) => {
                if (!$scope.unique && $scope.max <= $scope.list.length) {
                    $scope.list.push(obj);
                } else {
                    Object.assign($scope.list, obj);
                }

                this.ownResource = _.without(this.ownResource, obj);

                this.addMode = false;
                this.search = '';
            };

            this.removeItem = (obj) => {
                this.ownResource.push(obj);

                if (!$scope.unique) {
                    $scope.list = _.without($scope.list, obj);
                } else {
                    Object.assign($scope.list, {});
                }
            };

            this.checkUnique = () => {
                if ($scope.unique) {
                    return _.isEmpty($scope.list);
                }

                return true;
            }
        },
        controllerAs        : '$ctrl',
        template            : `<section class="add-object">
                                    <span ng-if="unique" class="-va-m">{{list[keyToDisplay]}} </span>
                                    <span ng-repeat="selected in list" ng-if="keyToDisplay && list.length && !unique" class="display-list">
                                        <span class="-va-m">{{selected[keyToDisplay]}} </span>
                                        <span class="glyphicon glyphicon-remove -fs-8 remove-btn" ng-click="$ctrl.removeItem(selected)"></span>
                                    </span>
                                    <butoon class="add-btn app-grey-btn"
                                            ng-if="!$ctrl.addMode && $ctrl.checkUnique() && max <= list.length" 
                                            ng-click="$ctrl.addMode = true">
                                            +
                                    </butoon>
                                    <div ng-if="$ctrl.addMode" class="add-box">
                                        <form>                                      
                                            <input
                                                class="app-input"
                                                type="text" 
                                                ng-model="$ctrl.search" 
                                                placeholder="Search...">
                                             <butoon class="add-btn"
                                                ng-click="$ctrl.addMode = false">
                                                <span class="glyphicon glyphicon-remove remove-btn"></span>
                                             </butoon>
                                            <div class="list" ng-if="$ctrl.search">
                                                <div
                                                    class="item"
                                                    ng-repeat="obj in $ctrl.ownResource | filter: $ctrl.search"
                                                    ng-click="$ctrl.addToObject(obj)">
                                                    {{obj.name}}
                                                </div>
                                            </div>
                                        </form>  
                                    </div>
                                                                      
                               </section>`
    }
}

export default searchForItem;