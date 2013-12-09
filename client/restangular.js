// Restangular configuration

var app = angular.module('hasglaese');

app.config(function (RestangularProvider) {
    RestangularProvider.setParentless(['comments']);

    RestangularProvider.addElementTransformer('entries', false, function (entries) {
        entries.addRestangularMethod('upvote', 'post', 'up');
        entries.addRestangularMethod('downvote', 'post', 'down');
        return entries;
    });

    RestangularProvider.addElementTransformer('comments', false, function (comment) {
        comment.addRestangularMethod('upvote', 'post', 'up');
        comment.addRestangularMethod('downvote', 'post', 'down');
        return comment;
    });

});
