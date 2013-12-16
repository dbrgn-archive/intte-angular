// AngularJS controllers

var ctrl = angular.module('controllers', []);

ctrl.controller('MainCtrl', function ($scope, $rootScope, $http, entryFactory, storage, socket, errorHandler) {
    // Variables
    $rootScope.username = null;
    $rootScope.usercount = 0;

    // Bind username to local storage
    storage.bind($rootScope, 'username', {defaultValue: null, storeName: 'hasGlaeseUsername'});

    // User functions
    $rootScope.is_logged_in = function () {
        return !!$rootScope.username;
    }


    // Login function
    $scope.login = function () {
        $http.post('/login', {
            'name': $scope.input_username,
            'password': $scope.input_password
        }).then(function (response) {
                if (response.data != "true") {
                    errorHandler(null, 'Login failed');
                } else {
                    $rootScope.username = $scope.input_username;
                    $scope.input_password = '';
                }
            }, function (reason) {
                errorHandler(reason, 'Login failed');
            });
    }

    // Logout function
    $scope.logout = function () {
        $http.post('/logout').then(function (response) {
            if (response.data != "true") {
                errorHandler(null, 'Logout failed');
            } else {
                $rootScope.username = null;
            }
        }, function (reason) {
            errorHandler(reason, 'Logout failed');
        });
    }

    // EntriesgetEntries
    function getEntries() {
        entryFactory.getEntries().then(function (entries) {
            $scope.entries = entries;
        }, function (reason) {
            errorHandler(reason, 'Failed to get entries');
        });
    }

    getEntries();

    // Websockets
    socket.on('Rated', function (message) {
        getEntries();
    });
    socket.on('AddLink', function (message) {
        getEntries();
    });
    socket.on('AddComment', function (message) {
        getEntries();
    });
    socket.rawSocket.on('usercount', function (message) {
        console.log('New usercount: ' + message.count);
        $scope.$apply(function () {
            $scope.usercount = message.count;
        });
    });

    // Destructor
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });
});

ctrl.controller('DetailCtrl', function ($scope, $routeParams, Restangular, entryDetailFactory, commentFactory, socket, $http) {

    function entryComments() {
        commentFactory.entryComments($routeParams.id).then(function (comments) {
            $scope.comments = comments;
        })
    }

    function getEntryDetails() {
        entryDetailFactory.getEntryDetails($routeParams.id).then(function (entry_detail) {
            $scope.entry_detail = entry_detail;
        })
    }


    getEntryDetails();
    entryComments();

    $scope.comment_input = "";

    // Websockets
    socket.on('Rated', function (message) {
        getEntryDetails();
        entryComments();
    });

    socket.on('AddComment', function (message) {
        getEntryDetails();
        entryComments();
    });

    $scope.post_comment = function post_comment(text) {
        $scope.entry_detail.post('comments', {'text': text});
        $scope.comment_input = "";
    }
});

ctrl.controller('NewPostCtrl', function ($scope, $http, $location, errorHandler) {
    $scope.addPost = function (post) {
        if ($scope.form.$valid) {
            $http.post('/entries',
                {
                    'title': $scope.newPost.title,
                    'url': $scope.newPost.URL
                }).then(function () {
                    $location.url('/index.html');
                }, function (reason) {
                    errorHandler(reason, 'Post failed')
                })
        }
    };
});

ctrl.controller('RegisterCtrl', function ($rootScope, $scope, $http, $window) {
    $scope.register = function (registerData) {
        $http.post('/register',
            {
                'name': registerData.name,
                'password': registerData.password
            }
        ).then(function (response) {
                if (response.data == 'true') {
                    $window.location.href = $rootScope.lastPage;
                }
            }, function (reason) {
                errorHandler(reason, 'Register failed')
            })
    };

});
