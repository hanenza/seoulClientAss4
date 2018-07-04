app.factory('UserServices', ['$http', function ($http) { //add reference to another service

}]);



app.controller('loginServiceController', ['UserServices', function (UserService) {
    let x = this;
    x.userService = UserService;

}]);