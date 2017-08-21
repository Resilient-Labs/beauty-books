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
    function HomeWeekController($http, $scope) {
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
  function HomeYearController($http, $scope) {
    let vm = this;
    vm.getYear = getYear;
    vm.getMonthAsString = getMonthAsString;
    var ctx = document.getElementById('yearChart').getContext('2d');
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: [],
        datasets: [{
          label: "Past Year",
          backgroundColor: 'rgb(175,27,63)',
          borderColor: 'rgb(175,27,63)',
          data: [],
        }]
      },

      // Configuration options go here
      options: {
        animation: { easing: "easeInOutCirc" },
      }
    });

    function getYear() {
      $http.get('/api/home/y')
        .then(function (response) {
          let data = response.data;
          $scope.timesToPlot = data.timeseries;

          vm.income = data.income;
          vm.tax = data.tax;
          vm.expenses = data.expenses;
          vm.net = data.net;

          for (var time in data.timeseries) {
            chart.data.datasets[0].data.push(data.timeseries[time].v);
            chart.data.labels.push(getMonthAsString(data.timeseries[time].t));
            if (time == data.timeseries.length - 1) {
              chart.update();
            }
          }
        })
    }
    getYear();

    function getMonthAsString(date) {
      // want to get the current date and find the month that today is in
      let monthStr = new Date(date.toString()).getMonth();
      let month = "";
      switch (monthStr) {
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
      return month.substring(0, 3);
    }
  }

    /*
     * Controls the flow of data for the home-month view
     * @constructor
     */
    function HomeMonthController($http, $scope) {
        let vm = this;
        let timesToPlot = [];
        vm.getMonth = getMonth;
        var ctx = document.getElementById('monthlyChart').getContext('2d');
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'line',
          // The data for our dataset
          data: {
            labels: daysInThisMonth(),
            datasets: [{
              label: getCurrentMonthAsString(),
              backgroundColor: 'rgb(175,27,63)',
              borderColor: 'rgb(175,27,63)',
              data: [],
            }]
          },
  
          // Configuration options go here
          options: {
            animation: { easing: "easeInOutCirc" },
          }
        });

      function getMonth() {
        $http.get('/api/home/m')
          .then(function (response) {
            let data = response.data;

            vm.income = data.income;
            vm.tax = data.tax;
            vm.expenses = data.expenses;
            vm.net = data.net;
            for (var time in data.timeseries) {
              chart.data.datasets[0].data.push(data.timeseries[time].v);
              if (time == data.timeseries.length - 1) {
                chart.update();
              }
            }
          })
      }
      getMonth(); 

      function getCurrentMonthAsString() {
        // want to get the current date and find the month that today is in
        let currMonth = new Date().getMonth();
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
      
    }

    /*
     * Controls the flow of data for the home-ytd view
     * @constructor
     */
    function HomeYTDController($http, $scope) {
        let vm = this;
        vm.getYtd = getYtd;
        vm.getMonthAsString = getMonthAsString;
        var ctx = document.getElementById('ytdChart').getContext('2d');
        var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'line',
  
          // The data for our dataset
          data: {
            labels: [],
            datasets: [{
              label: "Year to Date",
              backgroundColor: 'rgb(175,27,63)',
              borderColor: 'rgb(175,27,63)',
              data: [],
            }]
          },
  
          // Configuration options go here
          options: {
            animation: { easing: "easeInOutCirc" },
          }
        });

      function getYtd() {
        $http.get('/api/home/ytd')
          .then(function (response) {
            let data = response.data;
  
            vm.income = data.income;
            vm.tax = data.tax;
            vm.expenses = data.expenses;
            vm.net = data.net;

            for (var time in data.timeseries) {
              chart.data.datasets[0].data.push(data.timeseries[time].v);
              chart.data.labels.push(getMonthAsString(data.timeseries[time].t));
              if (time == data.timeseries.length - 1) {
                chart.update();
              }
            }
          })
      }
      getYtd();

      function getMonthAsString(date) {
        // want to get the current date and find the month that today is in
        let monthStr = new Date(date.toString()).getMonth();
        let month = "";
        switch (monthStr) {
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
        return month.substring(0, 3);
      }
    }

})();