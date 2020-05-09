app.controller('blogController', function($scope, $routeParams, $http, $cookies) {


    $scope.rootUrl = "https://arab02.herokuapp.com";
    $scope.singlePost = null;

    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');

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

    $scope.getFullPost = function() {
        let postId = $routeParams.postId;

        $http.get($scope.rootUrl + '/api/blog/' + postId).then(function success(response) {
            $scope.singlePost = response.data;

        });
        $scope.getPosts();
    }


    // $scope.getPostImage = function(postId) {
    //     
    //     $http.get($scope.rootUrl + '/api/blogPhoto/' + postId).then(function success(response) {
    //         return response.data;
    //     });
    // }

    $scope.userReply = "";

    $scope.sendReply = function(comment) {



        let obj = {
            commentId: comment._id,
            userId: $cookies.getObject('globals')._id,
            comment: $('#comment' + comment._id).val()
        }



        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/replycomment ",
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
    $scope.theComment = '';

    $scope.loggedIn = function() {
        let status = $cookies.get('status');
        if (status !== null && status == 'logged in') {
            return true;
        } else {
            return false;
        }
    }


    $scope.comment = function() {





        let obj = {
            comment: $scope.theComment,
            userId: $cookies.getObject('globals')._id,
            blogId: $routeParams.postId
        }



        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/comment",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {

            $scope.singlePost = response.data;

        }, function error(response) {
            console.log(response.statusText);
        });
    }

    $scope.posts = null;

    $scope.getPosts = function() {

        $http.get($scope.rootUrl + '/api/blog').then(function success(response) {
            $scope.posts = response.data.reverse();
        });
    }
});