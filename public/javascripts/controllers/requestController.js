var app = angular.module('arbitrage-bot');

app.controller('requestController', function ($rootScope, $scope, $location, $window) {

    // process the request from the search bar.
    $scope.processRequest= function(){
        $location.path('/vendor/'+getUrl($scope.vendorRequest));
    };

    function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

    function getUrl(vendor) {
        var vendorString = vendor.trim();
        vendorString = vendorString.replace(/ +/g, " ");
        vendorString = vendorString.replace(/\'/g, "");
        vendorString = toTitleCase(vendorString);
        vendorString.replace(/ +/g, '\%20');
        return vendorString;
    }
});
