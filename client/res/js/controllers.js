// AngularJS controllers

angular.module('hasglaese').controller('MainCtrl', function($scope, Restangular) {
    // Get username
    $scope.name = "Klothilde Ottilia Neuenschwander-Grossenbacher";

    // Get all entries
    Restangular.all('entries').getList().then(function(entries) {
        $scope.entries = entries;
    });
});
