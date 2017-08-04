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
    $scope.amounts = [
      { id: 2, total: 0, type: "Advertising", },
      { id: 3, total: 0, type: "Assets"},
      { id: 4, total: 0, type: "Commissions"},
      { id: 1, total: 0, type: "Communication"},
      { id: 5, total: 0, type: "Insurance"},
      { id: 6, total: 0, type: "Materials & Supples"},
      { id: 7, total: 0, type: "Meals & Entertainment"},
      { id: 9, total: 0, type: "Other"},
      { id: 8, total: 0, type: "Professional Services"},
    ];

    function init() {
      console.log("Expenses List Controller loaded");

      $http.get('/api/expense_type')
        .then(function (response) {
          let expensesData = response.data;
          console.log(expensesData.ret);
          vm.expenseTypes = expensesData.ret;
        });

      $http.get('/api/expense')
        .then(function (response) {
          let expenses = response.data;
          console.log(expenses);
          vm.expenses = expenses.records;
          for (var expense in vm.expenses) {
            let exp = vm.expenses[expense];
            for (var amount in $scope.amounts) {
              if (exp.expense_type_id == $scope.amounts[amount].id) {
                $scope.amounts[amount].total += exp.amount;
                console.log("added");
              }
            }
            console.log($scope.amounts);
          }

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