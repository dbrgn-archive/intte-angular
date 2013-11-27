// Configure Angular module

angular.module('hasglaese.service', []);
angular.module('hasglaese.directive', []);
angular.module('hasglaese.filter', []);
angular.module('hasglaese', [
    'hasglaese.service',
    'hasglaese.directive',
    'hasglaese.filter',
    'restangular',
    'angularLocalStorage',
]);
