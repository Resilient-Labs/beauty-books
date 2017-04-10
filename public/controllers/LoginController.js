(function() {
    angular
        .module("BeautyBooks")
        .controller("LoginController", LoginController);

    /*
     * Controls the flow of data for the login view
     * @constructor
     */
    function LoginController($location) {
        let vm = this;
        let open;
        vm.login = login;
        vm.learnMore = learnMore;

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
                UserService
                  .loginWithFacebook()
                  .then(function (response) {
                    console.log(response.data);
                  });

                $location.url("/home/");
            } else if (loginType == "login-google") {
                // Login code for Google then route to this location on success
              UserService
                .loginWithGoogle
              console.log("Login with Google");
                $location.url("/home/");
            }
        }
    }

    
})();
