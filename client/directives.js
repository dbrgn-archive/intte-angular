angular.module('hasglaese.directive', []).
    directive('ngUnique', ['$http', function ($http) {
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
    }]);
