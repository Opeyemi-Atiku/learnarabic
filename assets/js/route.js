app.constant('urls', {
    BASE: 'http://localhost',
    BASE_API: 'https://arab02.herokuapp.com'
}).config(function($routeProvider, $httpProvider) {

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);


    $routeProvider
        .when("/", {
            templateUrl: "pages/home.html",
            controller: "appController"
        })
        .when("/login", {
            templateUrl: "pages/login.html",
            controller: "loginController"
        })
        .when("/grammer-guide", {
            templateUrl: "pages/guide.html",
            controller: "appController"
        })
        .when("/pay", {
            templateUrl: "pages/pay.html",
            controller: "appController"
        })
        .when("/vocabularies", {
            templateUrl: "pages/vocabularies.html",
            controller: "vocabularyController"
        })
        .when("/blog-detail/:postId", {
            templateUrl: "pages/blog-details.html",
            controller: "blogController"
        })
        .when("/register", {
            templateUrl: "pages/register.html",
            controller: "registerController"
        })
        .when("/account", {
            templateUrl: "pages/account.html",
            controller: "registerController"
        })
        .when("/dashboard", {
            templateUrl: "pages/dashboard.html",
            controller: "userController",
            resolve: {
                "check": function($location, $cookies) {
                    let status = $cookies.get('status');
                    if (status !== null && status == 'logged in') {

                        $location.path('/dashboard');
                    } else {
                        $location.path('/login'); //redirect user to home.
                        // alert("You don't have access here");
                    }
                }
            }
        })
        .when("/account-settings", {
            templateUrl: "pages/profile.html",
            controller: "userController",
            resolve: {
                "check": function($location, $cookies) {
                    let status = $cookies.get('status');
                    if (status !== null && status == 'logged in') {


                    } else {
                        $location.path('/login'); //redirect user to home.
                        // alert("You don't have access here");
                    }
                }
            }
        })
        .when("/terms-and-conditions", {
            templateUrl: "pages/terms-and-conditions.html"
        })
        .when("/privacy-policy", {
            templateUrl: "pages/privacy-policy.html"
        })
        .when("/about", {
            templateUrl: "pages/about.html"
        })
        .when("/team", {
            templateUrl: "pages/team.html"
        })
        .when("/contact", {
            templateUrl: "pages/contact.html",
            controller: "contactController"
        })
        .when("/community", {
            templateUrl: "pages/community.html"
        })
        .when("/community-topic/:topic", {
            templateUrl: "pages/community_topic.html",
            controller: "communityController"
        })
        .when("/search-videos/:keyword", {
            templateUrl: "pages/search.html",
            controller: "appController"
        })
        .when("/community-post/:postId", {
            templateUrl: "pages/community_post.html",
            controller: "communityController"
        })
        .when("/blog", {
            templateUrl: "pages/blog.html",
            controller: 'blogController'
        })
        .when("/pricing", {
            templateUrl: "pages/pricing.html"
        })
        .when("/faq", {
            templateUrl: "pages/faq.html"
        })
        .when("/resource", {
            templateUrl: "pages/resource.html"
        })
        .when("/upgrade", {
            templateUrl: "pages/membership.html",
            resolve: {
                "check": function($location, $cookies) {
                    let status = $cookies.get('status');
                    if (status !== null && status == 'logged in') {
                        $location.path('/upgrade');
                    } else {
                        $location.path('/login'); //redirect user to home.
                        // alert("You don't have access here");
                    }
                }
            }
        })
        .when("/dialect/:dialect", {
            templateUrl: "pages/dialect.html",
            controller: "appController"
        })
        .when("/single-video/:videoId/:youtubeId", {
            templateUrl: "pages/single_video.html",
            controller: "appController",
            resolve: {
                "check": function($location, $cookies) {
                    let status = $cookies.get('status');
                    if (status !== null && status == 'logged in') {
                        // $location.path('/dashboard');
                    } else {
                        $location.path('/login'); //redirect user to home.
                        // alert("You don't have access here");
                    }
                }
            }
        })



    // home page/dashboard, dialect pages, log in and sign up page, about us, meet the team, contact, community blog, pricing, FAQ, resource






});