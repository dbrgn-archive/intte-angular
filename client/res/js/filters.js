// AngularJS filters

angular.module('hasglaese').filter('timeAgo', function() {
    return function(date) {
        return moment(date).fromNow();
    }
});
