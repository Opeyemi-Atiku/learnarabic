var app = angular.module('myApp', ["ngRoute", "ngStorage"]);

app.controller('appController', function($scope, $location, $http, $routeParams) {
    $scope.name = "yusuf";
    $scope.dialect = $routeParams.dialect;

});