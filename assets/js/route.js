app.constant('urls', {
    BASE: 'http://localhost',
    BASE_API: 'http://api.jwt.dev:8000/v1'
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
                    $location.path('/signin');
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
        .when("/blog-detail", {
            templateUrl: "pages/blog-details.html"
        })
        .when("/register", {
            templateUrl: "pages/register.html",
            controller: "registerController"
        })
        .when("/dashboard", {
            templateUrl: "pages/dashboard.html"
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
        .when("/blog", {
            templateUrl: "pages/blog.html"
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
            templateUrl: "pages/membership.html"
        })
        .when("/dialect/:dialect", {
            templateUrl: "pages/dialect.html",
            controller: "appController"
        })



    // home page/dashboard, dialect pages, log in and sign up page, about us, meet the team, contact, community blog, pricing, FAQ, resource






});