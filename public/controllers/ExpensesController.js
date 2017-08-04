(function() {
  angular
    .module("BeautyBooks")
    .controller("ExpensesAddController", ExpensesAddController)
    .controller("ExpensesListController", ExpensesListController);

  /**
   * Controls the flow of data for the expenses-annual view
   * @constructor
   */
  function ExpensesAddController(ExpenseService, $http, $routeParams, $scope, $location){
    let vm = this;
    // vm.toggleModal=toggleModal;
    // vm.showModal = false;
    vm.createExpense = createExpense;
    vm.deleteExpense = deleteExpense;
    vm.updateExpense = updateExpense;

    function init() {
      console.log("Expenses Add Controller loaded");
    }
    init();

    // function toggleModal(){
    //   console.log("works");
    //   vm.showModal=!vm.showModal
    // }
    
    function createExpense(expense) {
      $http.post('/api/expense', expense)
        .success(function (expense) {
          console.log(expense + " was created");
          $location.url("/expenses");
        })
        .error(function (err) {
          console.log("error");
          vm.error = "Could not add the expense";
        })
    }

    function deleteExpense() {

    }

    function updateExpense() {

    }

  }

  /**
   * Controls the flow of data for the expenses-quarterly view
   * @constructor
   */
  function ExpensesListController($http, $routeParams, $scope, $location) {
    let vm = this;

    function init() {
      console.log("Expenses List Controller loaded");

      $http.get('/api/expense_type')
        .then(function (response) {
          let expensesData = response.data;
          console.log(expensesData);
          console.log(expensesData.ret);
          vm.expenseTypes = expensesData.ret;
        })

      $http.get('/api/expense')
        .then(function (response) {
          let expenses = response.data;
          console.log(expenses);
        })
    }
    init();
  }

})();