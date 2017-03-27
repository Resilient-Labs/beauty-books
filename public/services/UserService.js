(function() {
  angular
    .module("BeautyBooks")
    .service("UserService", UserService);

  function UserService($http) {

    var api = {
      "createUser": createUser,
      "getUser": getUser,
      "updateUser": updateUser,
      "deleteUser": deleteUser
    };
    return api;

    function createUser(user) {
      return $http.post('/api/user', user);
    }
    function getUser(userId) {
      return $http.get('/api/user/'+userId);
    }
    function updateUser(userId, user) {
      return $http.put('/api/user/'+userId, user);
    }
    function deleteUser(userId) {
      return $http.delete('/api/user', userId);
    }
  }

})();
