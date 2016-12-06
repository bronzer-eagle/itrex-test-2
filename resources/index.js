import angular          from 'angular';

/**
 * MODULES
 */
import routesConfig     from './routes';

/**
 * COMPONENTS
 */

//**************AUTH************
import authComponent    from './app/components/auth-component/auth.component';
import loginComponent   from './app/components/auth-component/login/login.component';
import registerComponent   from './app/components/auth-component/register/register.component';


import homeComponent   from './app/components/home-component/home.component';

/**
 * SERVICES
 */

import UtilService      from './app/services/util.service'


/**
 * LIBS
 */

import 'angular-ui-router';

/**
 * OTHER
 */

import './index.scss';


angular.module('app', [
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', routesConfig])

    .component('authComponent', authComponent)
    .component('loginComponent', loginComponent)
    .component('registerComponent', registerComponent)

    .component('homeComponent', homeComponent)

    .service('utilService', UtilService)

;



require('./app/testModule')();