(function() {
    angular
        .module("BeautyBooks")
        .controller("AppointmentsAddController", AppointmentsAddController)
        .controller("AppointmentsListController", AppointmentsListController);

    /*
     * Controls the flow of data for the scheduler view
     * @constructor
     */
    function AppointmentsAddController($http, $routeParams, $scope, $location) {
        let vm = this;
        vm.addAppointment = addAppointment;
        vm.updateAppointment = updateAppointment;
        vm.deleteAppointment = deleteAppointment;

        function init() {
            console.log("Appointments Add Controller loaded");
        }
        init();

        function addAppointment(appt) {
          $http.post('/api/appointment', appt)
            .success(function (appt) {
              console.log(appt);
              console.log("appointment successfull added, now redrecting");
              $location.url("/appointments");
            })
            .error(function (err) {
              console.log("error");
              vm.error = "Could not add the appointment";
            })
        }

        function updateAppointment() {

        }

        function deleteAppointment() {

        }
    }

    function AppointmentsListController($http, $routeParams, $scope, $location) {
      let vm = this;

      function init() {
        console.log("Appointments List Controller loaded");
        $http.get('/api/appointment')
          .then(function (response) {
            vm.appts = response.data;
            console.log(vm.appts);
          })
      }
      init();
    }
})();