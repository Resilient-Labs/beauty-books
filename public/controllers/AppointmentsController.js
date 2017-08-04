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

        function init() {
            console.log("Appointments Add Controller loaded");
        }
        init();

        function addAppointment(appt) {
          $http.post('/api/appointment', appt)
            .success(function (appt) {
              $location.url("/appointments");
            })
            .error(function (err) {
              console.log("error");
              vm.error = "Could not add the appointment";
            })
        }

        function updateAppointment(apptId, appt) {
          $http.put('/api/appointment', appt)
            .success(function (appt) {

            })
            .error(function (err) {
              console.log("error updating");
            })
        }
    }

    function AppointmentsListController($http, $routeParams, $scope, $location) {
      let vm = this;
      vm.deleteAppointment = deleteAppointment;

      function init() {
        console.log("Appointments List Controller loaded");
        $http.get('/api/appointment')
          .then(function (response) {
            let appointments = response.data;
            vm.appts = appointments.records;
          })
      }
      init();

      function deleteAppointment(apptId, arrIdx) {
        let deletedClientName = vm.appts[arrIdx].client; //vm.appts[apptId].client;

        $http.delete('/api/appointment/'+apptId)
          .success(function (apptId, arrIdx) {
            vm.success = "Appointment for: " + deletedClientName + " was" +
              " successfully deleted!";
            vm.appts.splice(arrIdx,1);
            $location.url("/appointments");
          })
          .error(function (err) {
            console.log("Error deleting this appointment");
          })
      }
    }
})();