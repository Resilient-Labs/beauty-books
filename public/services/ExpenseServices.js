(function(){
  angular
    .module("BeautyBooks")
    .service("ExpenseService", ExpenseServices);

  function ExpenseServices($http){
    var api = {
    "createexpense": createExpense,
    "getexpense": getExpense,
    "updateexpense": updateExpense,
    "deleteexpense": deleteExpense
  };
  return api;

  function createExpense(expense){
    return $http.post('/api/expense', expense);
  }
  function createExpense(expense){
    return $http.get('/api/expense'+expenseId);
  }
  function createExpense(expenseId){
    return $http.put('/api/expense/'+expenseId, expense);
  }
  function createExpense(expenseId){
    return $http.delete('/api/expense', expenseId);
  }
}
})();
