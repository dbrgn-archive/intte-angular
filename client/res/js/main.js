// Add Restangular as a dependency to your app
angular.module('hasglaese', ['restangular']);

// Inject Restangular into your controller
angular.module('hasglaese').controller('MainCtrl', function($scope, Restangular) {
  // ...
});
