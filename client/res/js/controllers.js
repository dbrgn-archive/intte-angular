// AngularJS controllers

angular.module('hasglaese').controller('MainCtrl', function($scope, $http, Restangular) {
    // Username
    $scope.username = null;

    // User functions
    $scope.is_logged_in = function() {
        return !!$scope.username;
    }

    // Login function
    $scope.login = function() {
        $http.post('/login', {
            'name': $scope.input_username,
            'password': $scope.input_password
        }).then(function(response) {
            if (response.data != "true") {
                alert('Login failed.');
            } else {
                $scope.username = $scope.input_username;
                $scope.input_password = '';
            }
        }, function(reason) {
            alert('Failed: ' + reason.data + " (status " + reason.status + ")");
        });
    }

    // Logout function
    $scope.logout = function() {
        $http.post('/logout').then(function(response) {
            if (response.data != "true") {
                alert('Logout failed.');
            } else {
                $scope.username = null;
            }
        }, function(reason) {
            alert('Failed: ' + reason.data + " (status " + reason.status + ")");
        });
    }

    // Get all entries
    Restangular.all('entries').getList().then(function(entries) {
        $scope.entries = entries;
    });

});
