app.controller('registerController', function($scope, $http, $location, $cookies) {
    $scope.submit = true;

    $scope.alphanumeric = false;
    $scope.minLength = false;
    $scope.equal = false;
    $scope.passwordsMatch = false;

    $scope.user = {
        firstName: '',
        lastName: '',
        name: '',
        email: '',
        password: ''
    }


    // var letterNumber = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
    $scope.FBlogin = function() {
        FB.login(function(response) {
            if (response.authResponse) {
                
                FB.api('/me', {fields: 'first_name,last_name,email,name'}, function(response) {
                    
           
                    
                    $scope.user.name = response.name;
                    $scope.user.firstName = response.first_name;
                    $scope.user.lastName = response.last_name;
                    $scope.user.email = response.email;
                    $scope.user.password = '';
            
            
                    localStorage.setItem('userInfo', JSON.stringify($scope.user));
         
                    window.location.href='https://arabicdiscovery.com/site/#!/account';
                    
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'email' });
    }

    $scope.apiKey = 'AIzaSyBvSTkJ76BGtYQEWI9dBMwktJEn2vRpzNo';
    $scope.discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
    $scope.clientId = '686081405982-q6c3827ksm99dj0oas0b77h8r7n5d76l.apps.googleusercontent.com';




    $scope.SCOPES = "https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

    $scope.authorizeButton = document.getElementById('authorize-button');

    $scope.handleClientLoad = function() {
        // Load the API client and auth2 library
        gapi.load('client:auth2', $scope.initClient);
    }
    $scope.initClient = function() {
        gapi.client.init({
            apiKey: $scope.apiKey,
            discoveryDocs: $scope.discoveryDocs,
            clientId: $scope.clientId,
            scope: $scope.SCOPES
        }).then(function() {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen($scope.updateSigninStatus);
            // Handle the initial sign-in state.
            $scope.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            $scope.authorizeButton.onclick = $scope.handleAuthClick;
            //   signoutButton.onclick = handleSignoutClick;
        });
    }

    $scope.updateSigninStatus = function(isSignedIn) {
        
    }

    $scope.handleAuthClick = function(event) {
        gapi.auth2.getAuthInstance().signIn();
        $location.path('/account');
        $scope.makeApiCall();
        
    }

    $scope.handleSignoutClick = function(event) {
        gapi.auth2.getAuthInstance().signOut();
    }
        // Load the API and make an API call.  Display the results on the screen.
    $scope.makeApiCall = function() {
        gapi.client.people.people.get({
            'resourceName': 'people/me',
            'personFields': 'emailAddresses,names'
        }).then(function(resp) {

            name = resp.result.names[0].givenName + ' ' + resp.result.emailAddresses[0].value;

            $scope.user.name = resp.result.names[0].displayName;
            $scope.user.firstName = resp.result.names[0].givenName;
            $scope.user.lastName = resp.result.names[0].familyName;
            $scope.user.email = resp.result.emailAddresses[0].value;
            $scope.user.password = '';
            
            localStorage.setItem('userInfo', JSON.stringify($scope.user));
         
            window.location.href='https://arabicdiscovery.com/site/#!/account';

        });
    }
    
    $scope.getUserInfo = function () {
        let data = localStorage.getItem('userInfo');
        let userInfo = JSON.parse(data);
        $scope.user = angular.copy(userInfo);
        console.log(userInfo);
    }

    $scope.runCheck = function() {
        // if ($scope.password.match(letterNumber)) {
        //     $scope.alphanumeric = true;
        // } else {
        //     $scope.alphanumeric = false;
        // }
        if ($scope.user.password.length > 7) {
            $scope.minLength = true;
        } else {
            $scope.minLength = false;
        }
    }

    $scope.checkLoginStatus = function() {
        var status = localStorage.getItem('status');
        if (status == 'logged in') {
            $location.path('/dashboard');
        }
    }


    $scope.checkPasswords = function() {
        if ($scope.user.passwordTwo == $scope.user.password) {
            $scope.passwordsMatch = true;
        }
    }



    $scope.rootUrl = "https://arab02.herokuapp.com";

    $scope.loader = false;

    $scope.signUp = function() {

        $scope.loader = true;



        var data = new FormData();



        data.append("accountType", 'user');
        data.append("first_name", $scope.user.firstName);
        data.append("last_name", $scope.user.lastName);
        data.append("name", $scope.user.name);
        data.append("email", $scope.user.email);
        data.append("password", $scope.user.password);
        
        if (document.getElementById('photo') !== null) {
            data.append('photo', document.getElementById('photo').files[0])
        }





        console.log($scope.user);
        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/users",
            data: data,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined, 'Process-Data': false, transformRequest: angular.identity }
        }).
        then(function success(response) {

            var data = {
                email: $scope.user.email,
                password: $scope.user.password
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



            $scope.loader = false;

        }, function error(response) {
            console.log(response.statusText);
        });

    }


});