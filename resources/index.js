import angular          from 'angular';

/**
 * LIBS
 */

import 'angular-animate';
import 'angular-touch';
import 'angular-ui-bootstrap'
import 'angular-ui-router';
import 'angular-jwt';
import 'ng-file-upload';
import 'trix';
import 'angular-trix';
import ngInfiniteScroll from 'ng-infinite-scroll';

/**
 * COMPONENTS
 */

//**************AUTH************
import authComponent    from './app/components/auth-component/auth.component';
import loginComponent   from './app/components/auth-component/login/login.component';
import registerComponent   from './app/components/auth-component/register/register.component';
import restoreComponent   from './app/components/auth-component/restore/restore.component';

//**************HOME************

import homeComponent        from './app/components/home-component/home.component';
import messengerComponent   from './app/components/messenger-component/messenger.component';
import messageListComponent from './app/components/message-list-component/message-list.component';
import infoComponent        from './app/components/info-component/info.component';
import settingsComponent    from './app/components/settings-component/settings.component';
import adminComponent       from './app/components/admin-component/admin.component';

/**
 * SERVICES
 */

import UtilService              from './app/services/util.service';
import paginationService      from './app/services/pagination.service';
import alertService      from './app/services/alert.service'

/**
 * CONFIGS
 */
import routesConfig     from './app/configs/routes.config';
import angularJWTConfig from './app/configs/angularJWT.config';

/**
 * DIRECTIVES
 */

import searchForItem from './app/directives/searchForItem.directive';
import dragAndDropTable from './app/directives/dragAndDropTable.directive';

/**
 * FILTERS
 */

import dateFilter from './app/filters/date.filter';

/**
 * OTHER
 */

import './index.scss';

angular.module('app', [
    'ui.router',
    'angular-jwt',
    'ui.bootstrap',
    'ngFileUpload',
    'angularTrix',
    ngInfiniteScroll
])
    .config(['$qProvider', $qProvider => {$qProvider.errorOnUnhandledRejections(false);}])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', routesConfig])
    .config(['$httpProvider', 'jwtOptionsProvider', angularJWTConfig])

    .component('authComponent', authComponent)
    .component('loginComponent', loginComponent)
    .component('registerComponent', registerComponent)
    .component('restoreComponent', restoreComponent)

    .component('homeComponent', homeComponent)
    .component('messengerComponent', messengerComponent)
    .component('messageListComponent', messageListComponent)
    .component('infoComponent', infoComponent)
    .component('settingsComponent', settingsComponent)
    .component('adminComponent', adminComponent)

    .service('utilService', UtilService)
    .service('paginationService', paginationService)
    .service('alertService', alertService)

    .filter('dateFilter', dateFilter)

    .directive('searchForItem', searchForItem)
    .directive('dragAndDropTable', dragAndDropTable)

    .run(function(authManager) {
        authManager.redirectWhenUnauthenticated();
        authManager.checkAuthOnRefresh();
    })

;