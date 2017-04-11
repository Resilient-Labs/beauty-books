(function() {
    angular
        .module("BeautyBooks")
        .controller("LoginController", LoginController);

    /*
     * Controls the flow of data for the login view
     * @constructor
     */
    function LoginController(UserService, $location) {
        let vm = this;
        let open;
        vm.login = login;

        function init() {
            console.log("loaded");
            open = false;
        }
        init();

        function login(e, user) {
            let loginType = e.currentTarget.id;
            if (loginType == "login-facebook") {
                // Login code for facebook then route to this location on success
                console.log("Login with Facebook");
                // UserService
                //   .loginWithFacebook(user)
                //   .then(function (response) {
                //     console.log(response.data);
                //   });
              var protocol = $location.protocol();
              var host = $location.host();
              // host = host.slice(0, host.length - 1);
              var path = $location.path();
              var port = $location.port();
              console.log(protocol + "://" + host + ":" + port + "/login/facebook");
              var fburl = protocol + "://" + host + ":" + port + "/login/facebook";
              $location.url(fburl);
                // $location.url("/home/");
            } else if (loginType == "login-google") {
                // Login code for Google then route to this location on success
              UserService
                .loginWithGoogle(user)
                .then(function (response) {
                  console.log(response.data);
                  $location.url("/home/");
                });
              // console.log("Login with Google");
            }
        }
    }

    
})();
