// Restangular configuration

var app = angular.module('hasglaese');

app.config(function(RestangularProvider) {
    RestangularProvider.addElementTransformer('entries', false, function(entries) {
        entries.addRestangularMethod('upvote', 'post', 'up');
        entries.addRestangularMethod('downvote', 'post', 'down');
        return entries;
    });
});
