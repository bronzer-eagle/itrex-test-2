import angular          from 'angular';

/**
 * LIBS
 */

import 'angular-animate';
import 'angular-touch';
import 'angular-ui-bootstrap'
import 'angular-ui-router';
import 'angular-jwt';

/**
 * COMPONENTS
 */

//**************AUTH************
import authComponent    from './app/components/auth-component/auth.component';
import loginComponent   from './app/components/auth-component/login/login.component';
import registerComponent   from './app/components/auth-component/register/register.component';

//**************HOME************

import homeComponent        from './app/components/home-component/home.component';
import messengerComponent   from './app/components/messenger-component/messenger.component';
import MessageListComponent   from './app/components/message-list-component/message-list.component';

/**
 * SERVICES
 */

import UtilService              from './app/services/util.service'
import paginationService      from './app/services/pagination.service'

/**
 * CONFIGS
 */
import routesConfig     from './app/configs/routes.config';
import angularJWTConfig from './app/configs/angularJWT.config';

/**
 * DIRECTIVES
 */

import addObjectDirective from './app/directives/addObject.directive';

/**
 * OTHER
 */

import './index.scss';

angular.module('app', [
    'ui.router',
    'angular-jwt',
    'ui.bootstrap'
])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', routesConfig])
    .config(['$httpProvider', 'jwtOptionsProvider', angularJWTConfig])

    .component('authComponent', authComponent)
    .component('loginComponent', loginComponent)
    .component('registerComponent', registerComponent)

    .component('homeComponent', homeComponent)
    .component('messengerComponent', messengerComponent)
    .component('messageListComponent', MessageListComponent)

    .service('utilService', UtilService)
    .service('paginationService', paginationService)

    .directive('addObject', addObjectDirective)

    .run(function(authManager) {
        authManager.redirectWhenUnauthenticated();
        authManager.checkAuthOnRefresh();
    })

;