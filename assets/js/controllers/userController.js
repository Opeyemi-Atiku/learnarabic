app.controller('userController', function($scope, $http) {
    $scope.data = localStorage.getItem('user');
    $scope.user = JSON.parse($scope.data);
    $scope.name = $scope.user.name;
    $scope.loggedIn = localStorage.getItem('status') == 'logged in' ? true : false;
    $scope.password = null;

    $scope.minLength = false;
    $scope.equal = false;
    $scope.passwordsMatch = false;

    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');

    $scope.rootUrl = "https://arab02.herokuapp.com";

    $scope.getVideos = function() {
        let data = {
            show: 'show'
        }
        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/videoShow",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response.data);
            $scope.videos = response.data.reverse();
        }, function error(response) {
            console.log(response.statusText);
        });
    }

    $scope.getUser = function() {
        $scope.user = JSON.parse(localStorage.getItem('user'));
        console.log($scope.user);
    }

    $scope.state = 'recent';

    $scope.sort = function(sortBy) {

        if (sortBy == 'oldest') {
            if ($scope.state == 'recent') {
                $scope.videos = $scope.videos.reverse();
                $scope.state = 'oldest';
            }
        }

        if (sortBy == 'recent') {

            if ($scope.state == 'oldest') {

                $scope.videos = $scope.videos.reverse();

                $scope.state = 'recent';

            }
        }


    }

    $scope.checkPasswords = function() {
        if ($scope.password.newAgain == $scope.password.new) {
            $scope.passwordsMatch = true;
        }
    }
    $scope.passMessage = false;
    $scope.changePassword = function() {

        $http.get($scope.rootUrl + '/api/password/' + $scope.user._id + '?password=' + $scope.password.new + '&oldPassword=' + $scope.password.current).then(function success(response) {

            console.log(response.data);
            alert('Password successfully changed');
            $scope.passMessage = false;
        }, function error(response) {
            $scope.passMessage = true;
            console.log(response.data);
        });


    }



    $scope.runCheck = function() {
        // if ($scope.password.match(letterNumber)) {
        //     $scope.alphanumeric = true;
        // } else {
        //     $scope.alphanumeric = false;
        // }
        if ($scope.password.new.length > 7) {
            $scope.minLength = true;
        } else {
            $scope.minLength = false;
        }
    }

    $scope.editProfile = function() {
        var data = new FormData();
        data.append('email', $scope.user.email);
        data.append('first_name', $scope.user.first_name);
        data.append('name', $scope.user.name);
        data.append('last_name', $scope.user.last_name);

        if (document.getElementById('photo').files[0] !== undefined) {
            data.append('photo', document.getElementById('photo').files[0])
        }



        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/users/" + $scope.user._id,
            data: data,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined, 'Process-Data': false, transformRequest: angular.identity }
        }).
        then(function success(response) {
            alert("Profile Edited");
            console.log(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            $scope.user = response.data;

            window.location.reload();

        }, function error(response) {
            console.log(response.data);
        });
    }
});