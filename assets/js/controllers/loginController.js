app.controller('loginController', function($cookies, $http, $scope, $location) {
    $scope.email = '';
    $scope.password = '';
    $scope.rootUrl = '';
    $scope.loader = false;
    $scope.rootUrl = "https://arab02.herokuapp.com";
    $scope.message = null;



    // $scope.checkLoginStatus = function() {
    //     var status = localStorage.getItem('status');
    //     if (status == 'logged in') {
    //         $location.path('/dashboard');
    //     }
    // }
    $scope.reloadPage = function() {
        if (window.localStorage) {
            if (!localStorage.getItem('firstLoad')) {
                localStorage['firstLoad'] = true;

                window.location.reload();
            } else
                localStorage.removeItem('firstLoad');
        }
    }

    $scope.login = function() {
        $scope.loader = true;

        var data = {
            email: $scope.email,
            password: $scope.password
        }

        $http({
            method: "POST",
            url: $scope.rootUrl + "/auth/signin",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }
        }).
        then(function success(response) {
            var data = response.data;
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            localStorage.setItem('status', "logged in");


            $http.defaults.headers.common['Authorization'] = data.token;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();

            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.put('status', 'logged in', { expires: cookieExp });
            $cookies.putObject('globals', data.user, { expires: cookieExp });

            $scope.loader = false;
            $location.path('/dashboard');
            // window.location.reload();
        }, function error(response) {
            console.log(response);
            console.log(response.statusText);
            $scope.message = response.data.error;
        });


    }

});