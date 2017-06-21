/**
 * Created by muigai on 2/23/17.
 */
(function () {
    angular
        .module("BeautyBooks")
        .config(Configuration);

    /**
     * Configures the routes for the Single Page Application connecting controllers to views
     * @param $routeProvider
     */
    function Configuration($routeProvider, $locationProvider, $httpProvider) {
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
      $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

      // Define your routes here. Each "view" will have a route path
        // associated with it. Also, you will include a Controller for
        // each view to manipulate binded data
        $routeProvider
            /*
            When the url is root + / the webpage view loaded is the templateUrl set below.
             i.e. when on website.com/ the webpage shows the html in
             */
            .when("/", {
                templateUrl: "views/login/login.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            // Home Routes
            .when("/home", {
                templateUrl: "views/home/home-ytd.html",
                controller: "HomeYTDController",
                controllerAs: "model"
            })
            .when("/home/week", {
                templateUrl: "views/home/home-week.html",
                controller: "HomeWeekController",
                controllerAs: "model"
            })
            .when("/home/month", {
                templateUrl: "views/home/home-month.html",
                controller: "HomeMonthController",
                controllerAs: "model"
            })
            // Scheduler Routes
            .when("/appointments", {
                templateUrl: "views/appointments/appointments-list.html",
                controller: "AppointmentsListController",
                controllerAs: "model"
            })
            .when("/appointments/add", {
                templateUrl: "views/appointments/appointments-new.html",
                controller: "AppointmentsAddController",
                controllerAs: "model"
            })
            // Expenses Routes
            .when("/expenses", {
                templateUrl: "views/expenses/expenses-list.html",
                controller: "ExpensesListController",
                controllerAs: "model"
            })
            .when("/expenses/add", {
                templateUrl: "views/expenses/expenses-new.html",
                controller: "ExpensesAddController",
                controllerAs: "model"
            })
            // Settings Routes
            .when("/settings", {
                templateUrl: "views/settings/settings.html",
                controller: "SettingsController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/"
            })
    }

  function checkLoggedinService() {
    return $http.get('/api/loggedin')
      .then(function(response) {
        return response.data;
      }, function(err) { console.log(err); });
  }

  function checkLoggedin($q, $location, UserService) {
    var deferred = $q.defer();

    checkLoggedinService()
      .then(function(user) {
        if (user == '0') {
          $location.url('/login');
          deferred.reject();
        } else {
          $location.url('/user/'+user._id);
          deferred.resolve(user);
        }
      });
    return deferred.promise;
  }

})();
