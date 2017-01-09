/** @ngInject */
function angularJWTConfig($httpProvider, jwtOptionsProvider) {
    jwtOptionsProvider.config({
        tokenGetter                 : function() {
            return localStorage.getItem('token');
        },
        unauthenticatedRedirectPath : '/auth/login',
        unauthenticatedRedirector   : ['$state', function($state) {
            $state.go('login');
        }],
        whiteListedDomains          : ['localhost', window.location.host]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
}

angularJWTConfig.$inject = ['$httpProvider', 'jwtOptionsProvider'];

export default angularJWTConfig;