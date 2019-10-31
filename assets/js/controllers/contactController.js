app.controller('contactController', function($scope) {
    $scope.email = '';
    $scope.address = '';
    $scope.type = '';
    $scope.comment = '';

    $scope.contactUs = function() {
        alert("Sending...");
    }
});