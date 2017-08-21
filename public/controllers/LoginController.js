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
            open = false;
        }
        init();

        function login(e, user) {
            let protocol, host, path, port, fburl, googleurl;
            let loginType = e.currentTarget.id;
            if (loginType == "login-facebook") {
                // Login code for facebook then route to this location on success

              protocol = $location.protocol();
              host = $location.host();
              // host = host.slice(0, host.length - 1);
              path = $location.path();
              port = $location.port();
              fburl = protocol + "://" + host + ":" + port + "/login/facebook";
              window.location = fburl;
            } else if (loginType == "login-google") {
                // Login code for Google then route to this location on success

              protocol = $location.protocol();
              host = $location.host();
              path = $location.path();
               port = $location.port();
              googleurl = protocol + "://" + host + ":" + port + "/login/google";
              window.location = googleurl;
            }
        }
    }

    
})();
