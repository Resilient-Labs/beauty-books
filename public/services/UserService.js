(function() {
  angular
    .module("BeautyBooks")
    .service("UserService", UserService);

  function UserService($http) {
    var api = {
      // "createUser": createUser,
      "getUser": getUser,
      "updateUser": updateUser,
      // "deleteUser": deleteUser,
      "loginWithFacebook": loginWithFacebook,
      "loginWithGoogle":loginWithGoogle,
      "logout":logout
    };
    return api;

    // function createUser(user) {
    //   return $http.post('/api/user', user);
    // }
    function getUser(userId) {
      return $http.get('/api/user/'+userId);
    }
    function updateUser(userId, user) {
      return $http.put('/api/user/'+userId, user);
    }
    function loginWithFacebook(user) {
      return $http.post('/login/facebook', user);
    }

    function loginWithGoogle(user) {
      return $http.post('/login/google', user);
    }

    function logout() {

    }
    // function deleteUser(userId) {
    //   return $http.delete('/api/user', userId);
    // }
  }

})();
