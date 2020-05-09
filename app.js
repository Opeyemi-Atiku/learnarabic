var app = angular.module('myApp', ["ngRoute", "ngStorage", 'ngCookies']);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});

app.run(function($rootScope) {
    $rootScope.$on('$routeChangeStart', function(next, current) {
        $('.mobile-menu').removeClass('open');
        console.log('page changed');
    });
});

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/embed/**?enablejsapi=1&controls=0&playsinline=1'
    ]);
})

app.filter('capitalize', function() {
    return function(input) {
        return (angular.isString(input) && input.length > 0) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : input;
    }
});



app.controller('appController', function($cookies, $scope, $location, $http, $routeParams) {
    $scope.name = 'Account';
    $scope.dialect = $routeParams.dialect;
    $scope.videoId = $routeParams.videoId;
    $scope.comment = null;

    $scope.countries = [
        { name: "Algerian", image: "algeria" },
        { name: "Bahraini", image: "bahrain" },
        { name: "Egyptian", image: "egypt" },
        { name: "Emirati", image: "emirate" },
        { name: "Iraqi", image: "iraq" },
        { name: "Jordanian", image: "jordan" },
        { name: "Kuwaiti", image: "kuwait" },
        { name: "Lebanese", image: "lebanon" },
        { name: "Libyan", image: "libya" },
        { name: "Moroccan", image: "morocco" },
        { name: "MSA", image: "msa" },
        { name: "Omani", image: "oman" },
        { name: "Palestinian", image: "palestine" },
        { name: "Qatari", image: "qatar" },
        { name: "Saudi", image: "saudi" },
        { name: "Sudanes", image: "sudan" },
        { name: "Syrian", image: "syria" },
        { name: "Tunisian", image: "tunisia" },
        { name: "Yemeni", image: "yemen" }

    ]

    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');

    $scope.rootUrl = "https://arab02.herokuapp.com";


    $scope.saveVocabulary = function() {
        alert('World saved');
    }

    $scope.videoComment = function() {


        let obj = {
            comment: $scope.comment,
            userId: $cookies.getObject('globals')._id,
            videoId: $routeParams.videoId
        }





        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/videoComment",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response);
            $scope.singleVideo.comments = response.data.comments;
            $scope.comment = null;



        }, function error(response) {
            console.log(response.statusText);
        });
    }

    $scope.userReply = "";


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

    $scope.sendReply = function(comment) {



        let obj = {
            commentId: comment._id,
            userId: $cookies.getObject('globals')._id,
            comment: $('#comment' + comment._id).val()
        }


        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/videoReplycomment ",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response.data);
            $scope.singleVideo.comments = response.data.comments;
            $('#comment' + comment._id).addClass('hide');

        }, function error(response) {
            console.log(response.statusText);
        });


    }

    $scope.reloadPage = function() {
        // location.reload();
    }

    $scope.search = function() {
        var text = $('#searchText').val();
        $location.path('/search-videos/' + text);
    }

    $scope.getDialectVideos = function() {

        let data = {
            dialect: $routeParams.dialect
        }
        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/videoDialect",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {

            console.log(response.data);
            $scope.dialectVideos = response.data.reverse();

        }, function error(response) {
            console.log(response.statusText);
        });



    }

    $scope.searchResult = function() {

        var text = $routeParams.keyword;


        console.log(text);

        $http.get($scope.rootUrl + '/api/searchVideo?search=' + text).then(function success(response) {
            $scope.searchVideos = response.data.reverse();
            console.log($scope.searchVideos);

        });
    }

    $scope.getVideos = function() {
        // $http.get($scope.rootUrl + '/api/video').then(function success(response) {
        //     $scope.videos = response.data.reverse();
        //     console.log($scope.videos);
        // });


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

    $scope.getVideo = function() {
        let videoId = $routeParams.videoId;

        $http.get($scope.rootUrl + '/api/video/' + videoId).then(function success(response) {

            $scope.singleVideo = response.data;

            localStorage.setItem('video', JSON.stringify($scope.singleVideo));

            $scope.getTranscripts(videoId);



            let data = {
                dialect: $scope.singleVideo.dialect
            }
            $http({
                method: "POST",
                url: $scope.rootUrl + "/api/videoDialect",
                data: data,
                headers: { 'Content-Type': 'application/json', 'Process-Data': false }

            }).
            then(function success(response) {

                console.log(response.data);
                $scope.recommendedVideos = response.data.reverse();

                let ar = [];

                $.each($scope.recommendedVideos, function(index, obj) {
                    ar.push(obj.youtubeId);
                });
                localStorage.setItem('recommendedVideos', JSON.stringify(ar));


            }, function error(response) {
                console.log(response.statusText);
            });

        });







        // $http.get($scope.rootUrl + '/api/video').then(function success(response) {
        //     $scope.recommendedVideos = response.data.reverse();
        // });
    }

    $scope.arabicTranscripts = null;
    $scope.msaTranscripts = null;
    $scope.englishTranscripts = null;

    $scope.getTranscripts = function(videoid) {

        // Load arabic transcripts for current video
        console.log($cookies.get('googtrans'));
        console.log(navigator.language);

        var data = {
            videoId: $routeParams.videoId,
            type: 'arabic'
        }

        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/video/transcript",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response.data);
            $scope.arabicTranscripts = response.data;
            localStorage.setItem('arabic', JSON.stringify(response.data));

        }, function error(response) {
            console.log(response.statusText);
        });


        data = {
            videoId: $routeParams.videoId,
            type: 'msa'
        }

        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/video/transcript",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response.data);
            $scope.msaTranscripts = response.data;
            localStorage.setItem('msa', JSON.stringify(response.data));

        }, function error(response) {
            console.log(response.statusText);
        });



        data = {
            videoId: $routeParams.videoId,
            type: 'english'
        }

        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/video/transcript",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response.data);
            $scope.englishTranscripts = response.data;
            localStorage.setItem('english', JSON.stringify(response.data));

        }, function error(response) {
            console.log(response.statusText);
        });



    }

    $scope.state = 'recent';

    $scope.sort = function(sortBy) {

        if (sortBy == 'oldest') {
            if ($scope.state == 'recent') {
                if ($scope.videos) { $scope.videos = $scope.videos.reverse(); }
                if ($scope.dialectVideos) { $scope.dialectVideos = $scope.dialectVideos.reverse(); }
                if ($scope.searchVideos) { $scope.searchVideos = $scope.searchVideos.reverse(); }
                $scope.state = 'oldest';
            }
        }

        if (sortBy == 'recent') {

            if ($scope.state == 'oldest') {

                if ($scope.videos) { $scope.videos = $scope.videos.reverse(); }
                if ($scope.dialectVideos) { $scope.dialectVideos = $scope.dialectVideos.reverse(); }
                if ($scope.searchVideos) { $scope.searchVideos = $scope.searchVideos.reverse(); }
                $scope.state = 'recent';

            }
        }


    }

    $scope.getThumbnail = function(videoId) {
        return false;
        let url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyD--XiCg3KlI5-GHzqDAsL8NY8lCY0OyGI&part=snippet&id=" + videoId;

        $http.get(url).then(function success(response) {
            console.log(response.data.items[0].snippet.thumbnails.default.url);
            return response.data.items[0].snippet.thumbnails.default.url;

        }, function error(response) {

            console.log(response);
            console.log(response.statusText);
        });




    }



    $scope.reloadPage = function() {
        var youtubeId = $routeParams.youtubeId;
        $scope.youtubeUrl = "https://www.youtube.com/embed/" + youtubeId + "?enablejsapi=1&controls=0&playsinline=1";
        if (window.localStorage) {
            if (!localStorage.getItem('firstLoad')) {
                localStorage['firstLoad'] = true;

                window.location.reload();
            } else
                localStorage.removeItem('firstLoad');
        }
    }


    $scope.loggedIn = localStorage.getItem('status') == 'logged in' ? true : false;

    if (localStorage.getItem('status') == 'logged in') {
        $scope.data = localStorage.getItem('user');
        if ($scope.data) {
            $scope.user = JSON.parse($scope.data);
            $scope.name = $scope.user.name;
        }

    }







    $scope.logOut = function() {

        $cookies.remove('globals');
        $cookies.remove('status');

        // $http.defaults.headers.common.Authorization = 'Basic';

        localStorage.removeItem('status');
        localStorage.removeItem('user');

        $location.path('/login');
        // window.location.reload();
    }

    $scope.runTranscription = function() {
        alert('hello')
    }

});