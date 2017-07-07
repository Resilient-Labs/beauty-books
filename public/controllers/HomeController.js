(function() {
    angular
        .module("BeautyBooks")
        .controller("HomeWeekController", HomeWeekController)
        .controller("HomeMonthController", HomeMonthController)
        .controller("HomeYTDController", HomeYTDController);

    /*
     * Controls the flow of data for the home-week view
     * @constructor
     */
    function HomeWeekController($http, $routeParams, $scope) {
        let vm = this;

        function init() {
            console.log("Home Week Controller loaded");

            $http.get('/api/user')
            .then(function (response) {
              vm.user = response.data;
              $scope.user = response.data;
              console.log(vm.user);
            })
        }
        init();
      var ctx = document.getElementById('weeklyChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          datasets: [{
            label: "Weekly",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
          }]
        },

        // Configuration options go here
        options: {}
      });
    }

    /*
     * Controls the flow of data for the home-month view
     * @constructor
     */
    function HomeMonthController($http, $routeParams, $scope) {
        let vm = this;

        function init() {
            console.log("Home Month Controller loaded");
          $http.get('/api/user')
            .then(function (response) {
              $scope.user = response.data;
            })
          //console.log("help");
        }
        init();

      var ctx = document.getElementById('monthlyChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
            label: "Monthly",
            backgroundColor: 'rgb(155, 29, 112)',
            borderColor: 'rgb(155, 29, 112)',
            data: [0, 30, 3, 2, 8, 15],
          }]
        },

        // Configuration options go here
        options: {}
      });
    }

    /*
     * Controls the flow of data for the home-ytd view
     * @constructor
     */
    function HomeYTDController($http, $routeParams, $scope) {
        let vm = this;

        function init() {
            console.log("Home YTD Controller loaded");


            $http.get('/api/user')
            .then(function (response) {
              $scope.user = response.data;
              // vm.user = response.data;
              // console.log(vm.user);
            })
        }
        init();

      var ctx = document.getElementById('yearlyChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: ["2015", "2016", "2017"],
          datasets: [{
            label: "Yearly",
            backgroundColor: 'rgb(55, 79, 12)',
            borderColor: 'rgb(55, 79, 12)',
            data: [0, 10, 4],
          }]
        },

        // Configuration options go here
        options: {}
      });
    }

})();