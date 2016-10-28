var app = angular.module('arbitrage-bot');

app.controller('vendorController', function($rootScope, $routeParams, $scope, $http, $route, $location, $window) {
	$scope.vendor = $routeParams.vendor;
	var request = new window.XMLHttpRequest;
	var dir = '/data/'+$scope.vendor;
	request.open('GET', dir, false);
	request.send(null);
	$scope.result = request.responseText;
	if ($scope.result === "null") {
		$scope.message = "Sorry! Vendor not found";
	}
	else if ($scope.result === "none") {
		$scope.message = "Sorry! No arbitrage possible at this vendor";
	}
	else {
		$scope.list = JSON.parse($scope.result);
		$scope.profit = $scope.list[1];
		$scope.card = $scope.list[3];
		$scope.dollar = $scope.list[5];
		$scope.roi = parseFloat($scope.list[7]*100).toFixed(2);
		$scope.vendorList = [];
		$scope.profitList = [];
		$scope.cardList = [];
		$scope.costList = [];
		$scope.roiList = [];
		for (var i = 8; i < $scope.list.length; i++) {
			$scope.vendorList.push($scope.list[i]);
			i++;
			$scope.profitList.push($scope.list[i]);
			i++;
			$scope.cardList.push($scope.list[i]);
			i++;
			$scope.costList.push($scope.list[i]);
			i++;
			$scope.roiList.push($scope.list[i]);
		}
	}
});
