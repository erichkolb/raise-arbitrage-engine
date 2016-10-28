var app = angular.module('arbitrage-bot', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider.
		when('/', {
            templateUrl: '/views/partials/main.html',
            controller: 'mainController'
        }).
        when('/vendor/:vendor', {
            templateUrl: '/views/partials/vendor.html',
            controller: 'vendorController'
        }).
        otherwise({
            redirectTo: '/'
        });

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);