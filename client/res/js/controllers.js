// AngularJS controllers

angular.module('hasglaese').controller('MainCtrl', function($scope, $http, Restangular) {
    // Get username
    $scope.name = "Klothilde Ottilia Neuenschwander-Grossenbacher";

    // Get all entries
    Restangular.all('entries').getList().then(function(entries) {
        $scope.entries = entries;
    });

    // Login function
    $scope.login = function() {
        $http.post('/login', {
            'name': $scope.username,
            'password': $scope.password
        }).then(function(response) {
            var success = response.data;
            if (success == "true") {
                alert('Login successful.');
            } else {
                alert('Login failed.');
            }
        }, function(reason) {
            alert('Failed: ' + reason.data + " (status " + reason.status + ")");
        });
    };
});
