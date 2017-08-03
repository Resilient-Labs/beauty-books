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
            console.log(appointments.records);
          })
      }
      init();

      function deleteAppointment(e) {
        console.log(e.currentTarget);

        // $http.delete('/api/appointment/'+apptId)
        //   .success(function (appt) {
        //
        //   })
        //   .error(function (err) {
        //     console.log("error deleting");
        //   })
      }
    }
})();