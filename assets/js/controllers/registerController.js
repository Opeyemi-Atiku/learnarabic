app.controller('registerController', function($scope) {
    $scope.name = '';
    $scope.submit = true;
    $scope.email = '';
    $scope.name = '';
    $scope.password = '';
    $scope.passwordTwo = '';
    $scope.phone = '';
    $scope.alphanumeric = false;
    $scope.minLength = false;
    $scope.equal = false;
    $scope.passwordsMatch = false;

    // var letterNumber = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;

    $scope.runCheck = function() {
        // if ($scope.password.match(letterNumber)) {
        //     $scope.alphanumeric = true;
        // } else {
        //     $scope.alphanumeric = false;
        // }
        if ($scope.password.length > 7) {
            $scope.minLength = true;
        } else {
            $scope.minLength = false;
        }
    }



    $scope.checkPasswords = function() {
        if ($scope.passwordTwo == $scope.password) {
            $scope.passwordsMatch = true;
        }
    }








    $scope.signUp = function() {
        alert('Signing In...');
    }


});