function searchForItem() {
    return {
        restrict            : 'E',
        scope               : {
            list            : '=',
            resource        : '='
        },
        controller          : function ($scope) {
            let self = this;
            this.addMode = false;
            this.addToObject = function (obj) {
                $scope.list.push(obj);
                self.addMode = false;
                self.search = '';
            }
        },
        controllerAs        : '$ctrl',
        template            : `<section class="add-object">
                                    <butoon class="add-btn app-grey-btn"
                                            ng-if="!$ctrl.addMode" 
                                            ng-click="$ctrl.addMode = true">
                                            +
                                    </butoon>
                                    <div ng-if="$ctrl.addMode">
                                        <form>                                      
                                            <input
                                                class="app-input"
                                                type="text" 
                                                ng-model="$ctrl.search" 
                                                placeholder="Search...">
                                             <butoon class="add-btn app-grey-btn"
                                                ng-click="$ctrl.addMode = false">
                                                X
                                             </butoon>
                                            <div class="list" ng-if="$ctrl.search">
                                                <div
                                                    class="item"
                                                    ng-repeat="obj in resource | filter: $ctrl.search"
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