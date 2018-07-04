angular.module('citiesApp')
.controller('homeController', ['$scope','$http', '$window','setHeadersToken','localStorageModel', function ($scope,$http, $window,setHeadersToken,localStorageModel) {
    var self = this;
    self.cookieUser = '';
    self.User = { Username: '', Password: '' };
    self.QuestionID='';
    self.Answer='';
    self.Username='';
    self.pois=[];  
    self.isLoggedin=false;
    self.twoRecentPoi=[];
    self.top2Poi=[];
    self.hasSavedPoi=false;
    self.myIndex='';
    self.currentPoi='';
    self.showDetailsBoolean0=false;
    self.showDetailsBoolean1=false;
    self.showDetailsBoolean2=false;
    self.showPOI=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    self.questions=[];
    self.reviews1='';
    self.reviews2='';
    self.date1='';
    self.date2='';
 

    $http.get('http://localhost:5050/Poi/ThreeMostPopular/80').then(function (response) {
      var returnData = response.data;
      self.top3 = returnData;

      if ( $scope.indxCtrl.isLoggedin==true)
      {
        self.isLoggedin=true;
        self.TwoRecentPointsOfInterest();
        self.Top2PointsOfInterest();


      }

      $http.get('http://localhost:5050/Poi/Questions').then(function (response) {
      self.questions=response.data;

    
  }, function (errResponse) {
  
      });
    
     

    }, function (errResponse) {
      

        });  
    
        self.checkUsernameAndRegister = function (valid) {
         
      };


      self.login = function (valid) {    
        $http.post('http://localhost:5050/Users/Login',self.User).then(function (response) {
        if (!response.data.success){
          $window.alert(response.data)

        }
        else {
          $window.alert('Logged in succefully')
          self.twoRecentPoi=[];
          self.top2Poi=[];

          self.login.content = response.data.token;
          setHeadersToken.set(self.login.content, self.User.Username);
          $scope.indxCtrl.userName=self.User.Username;
          $scope.indxCtrl.isLoggedin=true;
          //setHeadersToken.setUserName(self.User.Username);
          self.addTokenToLocalStorage();
          self.isLoggedin=true;

          localStorageModel.addLocalStorage('UserName', self.User.Username);

          self.TwoRecentPointsOfInterest();
          self.Top2PointsOfInterest();
  
        }

                
      }, function (errResponse) {
        
        $window.alert(errResponse.data)

          });
        
          };

          self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        }


      

      self.retreivePassword = function () {   
 
          
          $http.post('http://localhost:5050/Users/PasswordRetrievel',{ Username: self.Username, QuestionID:self.QuestionID.QuestionID, Answer:self.Answer}).then(function (response) {
            var password=response.data[0];
           
           $window.alert('your password is'+" "+password.Password+"")
                  
    
        }, function (errResponse) {
          
          $window.alert(errResponse.data)

            });

            };

    /*    self.showDetails= function(index,poiID){
          var addViewers=false;
          if (index==0){
            if (self.showDetailsBoolean0==false){
              self.showDetailsBoolean0=true;
              self.showDetailsBoolean1=false;
              self.showDetailsBoolean2=false;
              addViewers=true;
              self.myIndex=0;
            }
            else{
              self.showDetailsBoolean0=false;
            }

          }
          if (index==1){
            if (self.showDetailsBoolean1==false){
              self.showDetailsBoolean1=true;
              self.showDetailsBoolean0=false;
              self.showDetailsBoolean2=false;
              addViewers=true;
              self.myIndex=1;
            }
            else{
              self.showDetailsBoolean1=false;
  
            }

          }
          if (index==2){
            if (self.showDetailsBoolean2==false){
              self.showDetailsBoolean2=true;
              self.showDetailsBoolean0=false;
              self.showDetailsBoolean1=false;
              addViewers=true;
              self.myIndex=2;
            }
            else{
              self.showDetailsBoolean2=false;
  
            }

          }
         //raise the number of viewers for this point of interest by one
        if (addViewers==true){
          $http.get('http://localhost:5050/Poi/viewPointOfInterest/'+poiID).then(function (response) {
                                       
        }, function (errResponse) {
                
            });
          }

           //get the review and dates
        if (addViewers==true){
          $http.get('http://localhost:5050/Poi/PointOfInterestInfo/'+poiID).then(function (response) {
            
           if (response.data[1]){
            self.reviews1[index]=response.data[1].ReviewDescription;
            self.date1[index]=response.data[1].date+"";
           }
           if (response.data[2]){
            self.reviews2[index]=response.data[2].ReviewDescription;
            self.date2[index]=response.data[2].date+"";
           }
  
        }, function (errResponse) {

            });
          }
        } */
        self.showTop2=function(index,poiID){
        
          self.showDetails(index,poiID,1);
        }
        self.show2Recent=function(index,poiID){
          self.showDetails(index,poiID,2);
        }
        self.showTopThree=function(index,poiID){
          self.showDetails(index,poiID,3);
        }
        self.showDetails= function(index,poiID,arrName){
          self.reviews1=null
          self.reviews2=null;
          self.date1=null;
           self.date2=null; 
          if(arrName==1){
            self.pois=self.top2Poi;
          }
          if(arrName==2){
            self.pois=self.twoRecentPoi;
          }
          if(arrName==3){
            self.pois=self.top3;
          }
          var addViewers=false;
            if (self.showPOI[poiID]==false){
              var i;
              for (i = 0; i < self.showPOI.length; i++) { 
              self.showPOI[i]=false;
                }
      
                for(var j=0;j<self.pois.length;j++){                
                  if(self.pois[j].ID==poiID){
                      self.currentPoi=self.pois[j];
                     
                  }
              }
              self.showPOI[poiID]=true;
             
              addViewers=true;
              
            }
            else{
                self.showPOI[poiID]=false;
    
            }
    
          
         //raise the number of viewers for this point of interest by one
        if (addViewers==true){
          $http.get('http://localhost:5050/Poi/viewPointOfInterest/'+poiID).then(function (response) {
                                       
        }, function (errResponse) {
                
            });
          }
    
           //get the review and dates
        if (addViewers==true){
          $http.get('http://localhost:5050/Poi/PointOfInterestInfo/'+poiID).then(function (response) {

              if(response.data[1]){
               self.reviews1=response.data[1].ReviewDescription;
               self.date1=response.data[1].date+"";
                }
               else{
                 self.reviews1='';
                  self.data1=''+"";
              }
              if(response.data[2]){
               self.reviews2=response.data[2].ReviewDescription;
               self.date2=response.data[2].date+"";
              }
              else{
                self.reviews2='';
                self.data2=''+"";
            }
           
        }, function (errResponse) {
    
            });
          }
        } 

        //get 2 RecentPointsOfInterest
        self.TwoRecentPointsOfInterest = function () {    
          
          $http.get('http://localhost:5050/RegisteredUsers/TwoRecentPointsOfInterest').then(function (response) {
            
            self.twoRecentPoi=response.data;
            self.hasSavedPoi=true;
            

                  
        }, function (errResponse) {
          self.hasSavedPoi=false;

            });

            };

         //get 2 top poi's of the user
        self.Top2PointsOfInterest = function () {    
          
          $http.get('http://localhost:5050/RegisteredUsers/Top2PointsOfInterest').then(function (response) {

           
          if (response.data!="false" && response.data!="false2" &&  response.data!="false3"){

            self.top2Poi=response.data;
          }
          
           
          
        }, function (errResponse) {
          
        

            });

            };

}]);




