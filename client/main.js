// Configure Angular module

angular.module('hasglaese.service', []);
//angular.module('hasglaese.directive', []);
angular.module('hasglaese.filter', []);
var hasglaeseApp = angular.module('hasglaese', [
    'hasglaese.service',
    'hasglaese.directive',
    'hasglaese.filter',
    'restangular',
    'angularLocalStorage',
    'ngRoute',
    'controllers'
]);

hasglaeseApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/',
        {
            templateUrl: 'partials/start.html',
            controller: 'MainCtrl'
        }).
        when('/detail/:id',
        {
            templateUrl: 'partials/detail.html',
            controller: 'DetailCtrl'
        }).when('/new_post',
        {
            templateUrl: 'partials/new_post.html',
            controller: 'NewPostCtrl'

        }).when('/register',
        {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

hasglaeseApp.run(function ($rootScope, $location) {
    $rootScope.lastPage = '';
    $rootScope.$on('$locationChangeStart', function (evt, absNewUrl, absOldUrl) {
        $rootScope.lastPage = absOldUrl;
        console.log($rootScope.lastPage)
    })
})



