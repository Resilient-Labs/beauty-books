(function() {
    angular
        .module("BeautyBooks")
        .controller("AppointmentsAddController", AppointmentsAddController)
        .controller("AppointmentsListController", AppointmentsListController);

    /*
     * Controls the flow of data for the scheduler view
     * @constructor
     */
    function AppointmentsAddController() {
        let vm = this;

        function init() {
            console.log("Appointments Add Controller loaded");
        }
        init();
    }

    function AppointmentsListController() {
      let vm = this;

      function init() {
        console.log("Appointments List Controller loaded");
      }
      init();
    }
})();