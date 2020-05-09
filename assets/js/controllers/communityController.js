app.controller('communityController', function($scope, $routeParams, $cookies, $http, $location) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');

    $scope.topic = $routeParams.topic;

    $scope.posts = null;

    $scope.rootUrl = "https://arab02.herokuapp.com";

    $scope.post = {
        title: '',
        text: '',
    }

    $scope.singlePost = null;

    $scope.reply = function(id) {

        let replyBox = $("#" + id);

        if (replyBox.hasClass('show')) {
            replyBox.removeClass('show');
            replyBox.addClass('hide');
        } else {
            replyBox.addClass('show')
            replyBox.removeClass('hide');
        }


    }

    $scope.comment = function() {


        let obj = {
            comment: $scope.theComment,
            userId: $cookies.getObject('globals')._id,
            forumId: $routeParams.postId
        }




        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/message",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {

            $scope.singlePost = response.data;

        }, function error(response) {
            console.log(response.statusText);
        });
    }



    $scope.getFullPost = function() {

        let postId = $routeParams.postId;

        $http.get($scope.rootUrl + '/api/forum/' + postId).then(function success(response) {
            $scope.singlePost = response.data;
            console.log($scope.singlePost);

        });
        $scope.getPosts();
    }

    $scope.loggedIn = function() {
        let status = $cookies.get('status');
        if (status !== null && status == 'logged in') {
            return true;
        } else {
            return false;
        }
    }



    $scope.getDialectPosts = function() {


        console.log($scope.topic);
        let obj = {
            category: $scope.topic
        }
        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/category",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {

            console.log(response.data);
            $scope.posts = response.data;

        }, function error(response) {
            console.log(response.statusText);
        });
    }

    $scope.addPost = function() {

        let user = $cookies.getObject('globals');
        console.log(user);


        var fd = new FormData();



        fd.append('photo', document.getElementById('postImage').files[0]);
        fd.append('title', $scope.post.title);
        fd.append('text', $scope.post.post);
        fd.append('category', $scope.topic);
        fd.append('postedBy', user._id);

        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/forum",
            data: fd,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined, 'Process-Data': false, transformRequest: angular.identity }

        }).
        then(function success(response) {

            console.log(response.data);
            $scope.post = {
                title: '',
                text: ''
            };
            window.location.reload();

        }, function error(response) {
            console.log(response.statusText);
        });


    }

    $scope.sendReply = function(comment) {



        let obj = {
            commentId: comment._id,
            userId: $cookies.getObject('globals')._id,
            comment: $('#comment' + comment._id).val()
        }



        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/replymessage",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            $scope.singlePost = response.data;
            $('#comment' + comment._id).addClass('hide');

        }, function error(response) {
            console.log(response.statusText);
        });


    }

    $scope.getPosts = function() {

        $http.get($scope.rootUrl + '/api/forum').then(function success(response) {
            $scope.posts = response.data.reverse();
            console.log($scope.posts);
        });


    }


});