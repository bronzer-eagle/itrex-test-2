/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise('home/message-list');

    $stateProvider

    /**
     * AUTH FLOW
     */

        .state('auth', {
            url         : '/auth',
            abstract    : true,
            component   : 'authComponent'
        })

        .state('login', {
            parent      : 'auth',
            url         : '/login',
            component   : 'loginComponent'
        })

        .state('register', {
            parent      : 'auth',
            url         : '/register',
            component   : 'registerComponent'
        })

    /**
     * USER PAGE STATES
     */

        .state('base', {
            url     : '/',
            abstract: true,
            template: require('../base/base.template.html')
        })

        .state('info', {
            parent      : 'base',
            url         : 'info',
            component   : 'infoComponent',
            params      : {
                type    : '',
                msg     : '',
                email   : ''
            },
            data        : {
                requiresLogin: false
            }
        })

        .state('home', {
            parent      : 'base',
            redirectTo  : 'message-list',
            url         : 'home',
            component   : 'homeComponent',
            data: {
                requiresLogin: true
            }
        })

        .state('send-message', {
            parent      : 'home',
            url         : '/send-message',
            component   : 'messengerComponent',
            params      : {
                receiver: null
            }
        })

        .state('message-list', {
            parent      : 'home',
            url         : '/message-list',
            component   : 'messageListComponent',
        })

        .state('settings', {
            parent      : 'home',
            url         : '/settings',
            component   : 'settingsComponent',
        })
}

routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default routesConfig;


