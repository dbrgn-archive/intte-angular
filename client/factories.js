// AngularJS factories

var app = angular.module('hasglaese');

app.factory('entryFactory', function(Restangular) {
    var factory = {};

    factory.getEntries = function() {
        return Restangular.all('entries').getList();
    };

    return factory;
});

app.factory('socket', function($rootScope) {
    var socket = io.connect();
    socket.on('disconnect', function() {
        alert('Websocket connection lost.');
    });
    return {
        on: function(eventName, callback) {
            socket.on("message", function(message) {
                console.log(message);
                var action = message.action;
                if (action == eventName) {
                    console.log("New message: " + action);
                    callback();
                }
            });
        },
        rawSocket: socket,
        removeAllListeners: function() {
            socket.removeAllListeners();
        }
    }
});
