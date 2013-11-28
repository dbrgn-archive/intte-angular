// AngularJS factories

var app = angular.module('hasglaese');

app.factory('entryFactory', function(Restangular) {
    var factory = {};

    factory.getEntries = function() {
        return Restangular.all('entries').getList();
    };

    return factory;
});
