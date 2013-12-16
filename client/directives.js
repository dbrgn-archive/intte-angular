// AngularJS directives

var app = angular.module('hasglaese');

app.directive('ngUnique', function ($http) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            elem.on('keyup', function (event) {
                scope.$apply(function () {
                    $http.get(attr.ngUnique + elem.val()).then(function (response) {
                        var exists = response.data == 'true';
                        ctrl.$setValidity('unique', !exists);
                    });
                })
            })
        }
    }
});

app.directive('voteUp', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/vote_up.html',
        replace: true
    }
});

app.directive('voteDown', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/vote_down.html',
        replace: true
    }
});
