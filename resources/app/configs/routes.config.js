/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise('home/message-list');

    $stateProvider

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


        .state('base', {
            url     : '/',
            abstract: true,
            template: require('../base/base.template.html')
        })

        .state('home', {
            parent      : 'base',
            redirectTo  : 'message-list',
            url         : 'home',
            component   : 'homeComponent'
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
}

routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default routesConfig;


