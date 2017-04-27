(function() {
<<<<<<< HEAD
    angular
        .module("BeautyBooks")
        .controller("ExpensesAnnualController", ExpensesAnnualController)
        .controller("ExpensesQuarterlyController", ExpensesQuarterlyController);

    /**
     * Controls the flow of data for the expenses-annual view
     * @constructor
     */
    function ExpensesAnnualController(){
        let vm = this;
        vm.toggleModal=toggleModal;
        vm.showModal = false;

        function init() {
            console.log("Expenses Annual Controller loaded");
        }
        init();

        function toggleModal(){
          console.log("works");
          vm.showModal=!vm.showModal
        }

=======
  angular
    .module("BeautyBooks")
    .controller("ExpensesAnnualController", ExpensesAnnualController)
    .controller("ExpensesQuarterlyController", ExpensesQuarterlyController);

  /**
   * Controls the flow of data for the expenses-annual view
   * @constructor
   */
  function ExpensesAnnualController(ExpenseService, $location){
    let vm = this;
    vm.toggleModal=toggleModal;
    vm.showModal = false;
    vm.createExpense = createExpense;

    function init() {
      console.log("Expenses Annual Controller loaded");
    }
    init();

    function toggleModal(){
      console.log("works");
      vm.showModal=!vm.showModal
>>>>>>> upstream/master
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

  }

  /**
   * Controls the flow of data for the expenses-quarterly view
   * @constructor
   */
  function ExpensesQuarterlyController() {
    let vm = this;

    function init() {
      console.log("Expenses Quarterly Controller loaded");
    }
    init();
  }

})();
