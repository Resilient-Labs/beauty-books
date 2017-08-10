(function() {
    angular
        .module("BeautyBooks")
        .controller("HomeWeekController", HomeWeekController)
        .controller("HomeMonthController", HomeMonthController)
        .controller("HomeYearController", HomeYearController)
        .controller("HomeYTDController", HomeYTDController);

    /*
     * Controls the flow of data for the home-week view
     * @constructor
     */
    function HomeWeekController($http, $routeParams, $scope) {
        let vm = this;
        vm.getWeek = getWeek;

        function init() {
            console.log("Home Week Controller loaded");

            $http.get('/api/user')
            .then(function (response) {
              vm.user = response.data;
              // vm.user.name = response.data.firstname + " " + response.data.lastname;
              $scope.user = response.data;
              $scope.user.name = response.data.firstname + " " + response.data.lastname;
            })
        }
        init();
        getWeek();

        function getWeek() {
          $http.get('/api/home/y')
            .success(function (response) {
              console.log(response.data);
            })
            .error(function (err) {
              console.log("error");
            })
        }
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
   * Controls the flow of data for the home-year view
   * @constructor
   */
  function HomeYearController($http, $routeParams, $scope) {
    let vm = this;
    vm.getYear = getYear;

    function init() {
      console.log("Home Year Controller loaded");

      $http.get('/api/user')
        .then(function (response) {
          vm.user = response.data;
          $scope.user = response.data;
          $scope.user.name = response.data.firstname + " " + response.data.lastname;
        })
    }
    init();
    getYear();

    function getYear() {
      $http.get('/api/home/y')
        .success(function (response) {
          console.log(response.data);
        })
        .error(function (err) {
          console.log("error");
        })
    }
    var ctx = document.getElementById('yearChart').getContext('2d');
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
        vm.getMonth = getMonth;

        function init() {
            console.log("Home Month Controller loaded");
          $http.get('/api/user')
            .then(function (response) {
              vm.user = response.data;
              $scope.user = response.data;
              $scope.user.name = response.data.firstname + " " + response.data.lastname;
            });
        }
        init();
        getMonth();
        let timesToPlot = [];

      function getMonth() {
        $http.get('/api/home/m')
          .success(function (response) {
            let data = response;
            console.log(data);
            $scope.timesToPlot = data.timeseries;
            $scope.income = response.income;
            $scope.tax = response.tax;
          })
          .error(function (err) {
            console.log("error");
          })
      }

      function getCurrentMonthAsString() {
        // want to get the current date and find the month that today is in
        var currMonth = new Date().getMonth();
        let month = "";
        switch (currMonth) {
          case 0: month = "January"; break;
          case 1: month = "February"; break;
          case 2: month = "March"; break;
          case 3: month = "April"; break;
          case 4: month = "May"; break;
          case 5: month = "June"; break;
          case 6: month = "July"; break;
          case 7: month = "August"; break;
          case 8: month = "September"; break;
          case 9: month = "October"; break;
          case 10: month = "November"; break;
          case 11: month = "December"; break;
          default: month = "";
        }
        return month;
      }
      console.log(getCurrentMonthAsString());
      /**
       * Populate an array with the each possible day in the current month
       * @returns {Array}
       */
      function daysInThisMonth() {
        let daysInThisMonth = [];
        var now = new Date();
        var lastDay = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
        for (var i = 1; i <= lastDay; i++) {
          daysInThisMonth.push(i);
        }
        return daysInThisMonth;
      }

      // function findPeakInMonth() {
      //   let highest = timesToPlot[0];
      //   for (var t in timesToPlot) {
      //     if (timesToPlot[t] >= highest) {
      //       highest = timesToPlot[t];
      //     }
      //   }
      //   return highest;
      // }

      function findDataNodeInThisMonth() {
        let arr = [];
        console.log("find data node in this month");
        for (let t in $scope.timesToPlot) {
          console.log("be humble");
          arr.push($scope.timesToPlot[t].v);
          console.log($scope.timesToPlot[t].v);
          console.log("urgh");
          console.log($scope.timesToPlot[t][v]);
        }
        return arr;
      }

      var ctx = document.getElementById('monthlyChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
          labels: daysInThisMonth(),
          datasets: [{
            label: getCurrentMonthAsString(),
            backgroundColor: 'rgb(155, 29, 112)',
            borderColor: 'rgb(155, 29, 112)',
            data: findDataNodeInThisMonth().forEach((dataset) => {
              dataset.data.push(data);
            }),
          }]
        },

        // Configuration options go here
        options: {}
      });
      // update the chart after the timesToPlot has updated
      $scope.$watch('timesToPlot', function () {
        console.log($scope.timesToPlot);
        chart.update();
      })
    }

    /*
     * Controls the flow of data for the home-ytd view
     * @constructor
     */
    function HomeYTDController($http, $routeParams, $scope, currentUser) {
        let vm = this;
        vm.getYtd = getYtd;

        function init() {
            console.log("Home YTD Controller loaded");

            $http.get('/api/user')
            .then(function (response) {
              vm.user = response.data;
              $scope.user = response.data;
              $scope.user.name = response.data.firstname + " " + response.data.lastname;
            })
        }
        init();
        getYtd();

      function getYtd() {
        $http.get('/api/home/ytd')
          .success(function (response) {
            console.log(response);
          })
          .error(function (err) {
            console.log("error");
          })
      }

      var ctx = document.getElementById('ytdChart').getContext('2d');
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