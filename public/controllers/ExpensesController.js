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
    vm.toggleModal=toggleModal;
    vm.showModal = false;
    vm.createExpense = createExpense;
    vm.deleteExpense = deleteExpense;
    vm.updateExpense = updateExpense;

    function init() {
      console.log("Expenses Add Controller loaded");
    }
    init();

    function toggleModal(){
      console.log("works");
      vm.showModal=!vm.showModal
    }
    
    function createExpense(expense) {
      ExpenseService
        .createExpense(expense)
        .then(function (response, err) {
          if (err) {
            console.log(err);
          } else {
            console.log(response.data);
          }
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
      console.log(vm.expenseTypes);
    }
    init();
  }

})();