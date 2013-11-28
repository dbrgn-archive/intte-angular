// AngularJS controllers

var app = angular.module('hasglaese');

app.controller('MainCtrl', function($scope, $rootScope, $http, entryFactory, storage, socket) {
    // Variables
    $rootScope.username = null;
    $rootScope.usercount = 0;

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

    // Entries
    function getEntries() {
        entryFactory.getEntries().then(function(entries) {
            $scope.entries = entries;
        });
    }
    getEntries();

    // Websockets
    socket.on('Rated', function(message) {
        getEntries();
    });
    socket.on('AddLink', function(message) {
        getEntries();
    });
    socket.on('AddComment', function(message) {
        getEntries();
    });
    socket.rawSocket.on('usercount', function(message) {
        console.log('New usercount: ' + message.count);
        $scope.$apply(function() {
            $scope.usercount = message.count;
        });
    });

    // Destructor
    $scope.$on('$destroy', function(event) {
        socket.removeAllListeners();
    });
});
