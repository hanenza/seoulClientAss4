angular.module('citiesApp')
    .controller('indexController',['setHeadersToken','localStorageModel','$http','$location','$scope','FavPoiService', function (setHeadersToken,localStorageModel,$http,$location, $scope,FavPoiService) {


        self = this;
        self.count=0;
        self.userName = setHeadersToken.userName;

        //self.isLoggedin=false;
        self.token=localStorageModel.getLocalStorage('token');

        if (self.token && self.token!=''){
            $http.defaults.headers.common[ 'token' ] = self.token;

            $http.get('http://localhost:5050/RegisteredUsers/OrderedPointsOfInterest').then(function (response) {
            

                //self.msg=self.response.data;
       
                if (response.data=='Invalid token!' || response.data=='Invalid token'){
                       
                   self.isLoggedin=false;
                   localStorageModel.remove('token')
                  // localStorageModel.remove('UserName');
                   self.userName="Guest";
       
               }
               else{
                   self.isLoggedin=true;
                   self.userName = localStorageModel.getLocalStorage('UserName');
                   setHeadersToken.token=self.token;
                   setHeadersToken.set(self.token,self.userName);

                  
               }
              
       
                }, function (errResponse) {
                
                    }); 
                   
        }
     
        else{
            self.isLoggedin=false;
            localStorageModel.remove('token')
            localStorageModel.remove('UserName');
            self.userName="Guest";
            
        }


     //log out
     self.logOut = function () { 
        self.count=0;
        FavPoiService.favPois=[];
        FavPoiService.countFav=0;
        self.isLoggedin=false;
        localStorageModel.remove('token')
       // localStorageModel.remove('UserName');
        self.userName="Guest";
        $location.path('/');
       

     };

    
    }]);
