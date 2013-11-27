// AngularJS controllers

angular
.module('hasglaese')
.controller('MainCtrl', function($scope, $rootScope, $http, Restangular, storage) {
    // Username
    $rootScope.username = null;

    // Bind username to local storage
    storage.bind($rootScope, 'username', {defaultValue: null, storeName: 'hasGlaeseUsername'});

    // User functions
    $scope.is_logged_in = function() {
        return !!$rootScope.username;
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
                $rootScope.username = $scope.input_username;
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
                $rootScope.username = null;
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
