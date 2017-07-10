(function() {
    angular
        .module("BeautyBooks")
        .controller("SettingsController", SettingsController)

    /*
     * Controls the flow of data for the settings view
     * @constructor
     */
    function SettingsController($http, $routeParams, $scope) {
        let vm = this;

        function init() {
            console.log("Settings Controller loaded");

        $http.get('/api/user')
          .then(function (response) {
            vm.user = response.data;
            $scope.user = response.data;
            $scope.user.name = response.data.firstname + " " + response.data.lastname;
          })
      }
      init();
    }
})();