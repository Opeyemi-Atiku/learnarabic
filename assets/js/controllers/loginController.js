app.controller('loginController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', function($rootScope, $scope, $location, $localStorage, Auth) {
    $scope.email = '';
    $scope.password = '';
    $scope.rootUrl = '';


    function successAuth(res) {
        $localStorage.token = res.token;
        window.location = "/";
    }

    $scope.signin = function() {
        var formData = {
            email: $scope.email,
            password: $scope.password
        };

        Auth.signin(formData, successAuth, function() {
            $rootScope.error = 'Invalid credentials.';
        })
    };

    $scope.signIn = function() {
        var data = {
            email: $scope.email,
            password: $scope.password
        }

        alert('signing in...');
    }

    $scope.signup = function() {
        var formData = {
            email: $scope.email,
            password: $scope.password
        };

        Auth.signup(formData, successAuth, function() {
            $rootScope.error = 'Failed to signup';
        })
    };

    $scope.logout = function() {
        Auth.logout(function() {
            window.location = "/"
        });
    };
    $scope.token = $localStorage.token;
    $scope.tokenClaims = Auth.getTokenClaims();
}]);