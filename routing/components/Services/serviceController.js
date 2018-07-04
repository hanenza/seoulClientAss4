
angular.module('citiesApp')
    // .service('myService', function () { this.set = function() {return "hello"} })
    .service('setHeadersToken',['$http', function ($http) {

        var self=this;
      
         self.token = "";
         //self.Username="Guest";
         self.userName="Guest";
         self.isLoggedIn=false;
        

        self.set = function (t, userName) {
            self.token = t
            $http.defaults.headers.common[ 'token' ] = t
            $http.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")
            self.isLoggedIn=true;
            self.userName=userName

            //var decoded=jwt.decode(token, {complete:true});   
         //   Username=decoded.payload.userName;

        }

        self.setUserName = function(Username) {
         self.Username=Username;
         self.userName=Username;
        };

    }])

    .service('FavPoiService',[ '$http', function ($http) {

        var self=this;
        
        self.favPois=[];
        self.savedPoints=[]; //saved points in DB
        self.countFav=0; //counts how many pois in the fav list
      //  self.favourites=[]; // favourites points ( NOT IN DB)
       //localStorageModel.addLocalStorage('fav', self.savedPoints);


        self.addPoi = function(poi) {
            self.favPois[poi[0].ID]=poi[0];
          //  localStorageModel.updateLocalStorage(fav,self.favPois);
            self.countFav++;
           
           };

        self.deletePoi = function(poi_id) {
        self.favPois[poi_id]='';
        self.countFav--;
       
       };

       self.setSavedPoints= function(savedPoints){ //points saved in the DB

         self.savedPoints=savedPoints
       }
/*
       self.setFavourites= function(favourites){ //points LOCAL saved pois (NOT IN THE DB) in the DB

        self.favourites=favourites
      }
*/
    }])
    
    .controller('serviceController', ['$location', '$http', 'setHeadersToken','localStorageModel', function ($location, $http, setHeadersToken,localStorageModel) {

        self = this;

        self.directToPOI = function () {
            $location.path('/poi')
        }

        let serverUrl = 'http://localhost:4100/'

        let user = {
            userName: "Shir",
            password: "abcd",
            isAdmin: true
        }


        self.signUp = function () {
            // register user
            $http.post(serverUrl + "Users/", user)
                .then(function (response) {
                    //First function handles success
                    self.signUp.content = response.data;
                }, function (response) {
                    //Second function handles error
                    self.signUp.content = "Something went wrong";
                });
        }

        self.login = function () {
            // register user
            $http.post(serverUrl + "Users/login", user)
                .then(function (response) {
                    //First function handles success
                    self.login.content = response.data.token;
                    setHeadersToken.set(self.login.content)


                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });
        }

        self.reg = function () {
            // register user
            $http.post(serverUrl + "reg/", user)
                .then(function (response) {
                    //First function handles success
                    self.reg.content = response.data;

                }, function (response) {
                    self.reg.content = response.data
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                });
        }

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        }



    }]);


