/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise('landing');

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
            url         : 'home',
            component   : 'homeComponent'
        })
}

routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default routesConfig;


