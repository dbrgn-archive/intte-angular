// Configure Angular module

var app = angular.module('hasglaese', [
    'controllers',
    'restangular',
    'angularLocalStorage',
    'ngRoute'
]);

app.config(function ($routeProvider) {
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
});

app.run(function ($rootScope, $location) {
    $rootScope.lastPage = '';
    $rootScope.$on('$locationChangeStart', function (evt, absNewUrl, absOldUrl) {
        $rootScope.lastPage = absOldUrl;
    })
})


