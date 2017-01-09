/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

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

        .state('email-verification', {
            parent      : 'auth',
            url         : '/email-verification',
            controller  : function ($location, $http, utilService, $state) {
                let
                    token       = $location.search().token,
                    notNewUser  = $location.search().notNewUser;

                $http({
                    url             : utilService.apiPrefix('auth/email-confirmation'),
                    method          : 'POST',
                    data            : {
                        token       : token,
                        notNewUser  : !!notNewUser
                    }
                }).then(res=>{
                    $state.go('info', {
                        message         : res.data.message,
                        type            : 'success',
                        options         : {
                            signInBtn   : function () {
                                $state.go('login');
                            }
                        }
                    });
                })
            },
            template    : `<ui-view></ui-view>`
        })

        .state('restore-password', {
            parent      : 'auth',
            url         : '/restore-password',
            component   : 'restoreComponent',
        })

    /**
     * USER PAGE STATES
     */

        .state('base', {
            url         : '/',
            abstract    : true,
            template    : require('../base/base.template.html')
        })

        .state('info', {
            parent      : 'base',
            url         : 'info',
            component   : 'infoComponent',
            params      : {
                type    : '',
                message : '',
                options : ''
            },
            data        : {
                requiresLogin: false
            }
        })

        .state('home', {
            parent      : 'base',
            redirectTo  : 'message-list',
            url         : 'home/',
            component   : 'homeComponent',
            data: {
                requiresLogin: true
            }
        })

        .state('send-message', {
            parent      : 'home',
            url         : 'send-message',
            component   : 'messengerComponent',
            params      : {
                receiver: null
            }
        })

        .state('message-list', {
            parent      : 'home',
            url         : 'message-list',
            component   : 'messageListComponent',
        })

        .state('settings', {
            parent      : 'home',
            url         : 'settings',
            component   : 'settingsComponent',
        })

        .state('admin', {
            parent      : 'home',
            url         : 'admin',
            component   : 'adminComponent',
        })
}

routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default routesConfig;


