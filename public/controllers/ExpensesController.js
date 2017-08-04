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
    vm.createExpense = createExpense;
    vm.deleteExpense = deleteExpense;
    vm.updateExpense = updateExpense;

    function init() {
      console.log("Expenses Add Controller loaded");

      $http.get('/api/expense_type')
        .then(function (response) {
          let expensesData = response.data;
          vm.expenseTypes = expensesData.ret;
        })
    }
    init();

    function createExpense(expense) {
      $http.post('/api/expense', expense)
        .success(function (expense) {
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
    let expenseTypesHolder, expensesHolder;
    let amounts = {
      advertising: { id: 1, amount: 0, },
      assets: { id: 1, amount: 0, },
      commissions: { id: 1, amount: 0, },
      communication: { id: 1, amount: 0, },
      insurance: { id: 1, amount: 0, },
      materialsSupplies: { id: 1, amount: 0, },
      mealsEntertainment: { id: 1, amount: 0, },
      other: { id: 9, amount: 0, },
      professionalServices: { id: 8, amount: 0, },
    };

    function init() {
      console.log("Expenses List Controller loaded");

      $http.get('/api/expense_type')
        .then(function (response) {
          let expensesData = response.data;
          console.log(expensesData.ret);
          vm.expenseTypes = expensesData.ret;
          // expenseTypesHolder = expensesData.ret;
        });

      $http.get('/api/expense')
        .then(function (response) {
          let expenses = response.data;
          console.log(expenses);
          vm.expenses = expenses.records;
          // expensesHolder = expenses.records;
        });

      // calculateExpenseTotals();
    }

    init();
    // console.log(expensesHolder);
    // console.log(expenseTypesHolder);

    function calculateExpenseTotals() {
      console.log("calc expenses");
      for (var expense in vm.expenses) {
        let exp = vm.expenses[expense];
        console.log("calc expenses first loop");
        for (var type in vm.expenseTypes) {
          console.log("calc expenses first loop");
          let expType = vm.expenseTypes[type];
          console.log(expType);
          if (expType == exp.expense_type_id) {
            vm.expenseTypes[type].totalAmount += exp.amount;
          }
        }
      }
    }

  }

})();