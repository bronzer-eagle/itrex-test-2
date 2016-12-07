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
import messengerComponent   from './app/components/messanger-component/messenger.component';

/**
 * SERVICES
 */

import UtilService      from './app/services/util.service'

/**
 * MODULES
 */
import routesConfig     from './app/configs/routes.config';
import angularJWTConfig from './app/configs/angularJWT.config';

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

    .service('utilService', UtilService)

    .run(function(authManager) {
        authManager.redirectWhenUnauthenticated();
        authManager.checkAuthOnRefresh();
    })

;