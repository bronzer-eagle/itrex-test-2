/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise('landing');

    $stateProvider

        // .state('in', {
        //     url:            '/',
        //     abstract:       true,
        //     template: '<ui-view/>'
        // })

        // .state('in.base', {
        //
        // })

        // .state('home', {
        //     parent:         'in.base',
        //     url:            'home?jwttoken',
        //     component:      'homeComponent'
        // })

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




        .state('home', {
            url         : '/home',
            component   : 'homeComponent'
        })
}

routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default routesConfig;


