// AngularJS filters

var app = angular.module('hasglaese');

app.filter('timeAgo', function () {
    return function(date) {
        return moment(date).lang('de').fromNow();
    }
});
