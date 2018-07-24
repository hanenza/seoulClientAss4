angular.module('citiesApp')
.controller('poiController', ['$http', '$window','setHeadersToken','localStorageModel','FavPoiService','$scope', function ($http, $window,setHeadersToken,localStorageModel,FavPoiService,$scope) {
    var self = this;
    self.pois=[]
    self.categories=[]
    self.filterCategory=''
    self.PoiName=''
    self.byName=''
    self.showRankingBoolean1=false;
    self.showRankingBoolean2=true;
    self.showByName=false;
    self.allPois=[]
    self.savedPOI=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    self.poiAmount=0;
    self.reviews1='';
    self.reviews2='';
    self.date1='';
    self.date2='';
    self.showPOI=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    self.poiAmountMSG='';
    self.currentPoi=''
    self.isLoggedIn;
    self.poiTobeSaved=''
    self.serena=0;
    self.showMap=false;
    self.map=null;
  
    self.myMap=function(){
      
       self.map = L.map('map').setView([51.505, -0.09], 13);
        
      L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(self.map);
      
      L.marker([self.currentPoi.x , self.currentPoi.y]).addTo(self.map)
          .bindPopup(self.currentPoi.Name+"")
          .openPopup();
          self.showMap=true;
    }
    
    self.hideMap=function(){

      self.showMap=false;
      if(self.map !== undefined || self.map !== null) {
        self.map.remove();
      }
    }
    //get all points of interests
    $http.get('http://localhost:5050/Poi/AllPointsOfInterest').then(function (response) {
        self.pois = response.data;
        self.allPois=response.data;
        self.getFavouritePoiAmount();
        self.isLoggedIn= $scope.indxCtrl.isLoggedin;

  
        //check which point is in the favourite and which is not.
        var favPois=FavPoiService.favPois;
        for (var i=0; i<favPois.length; i++){
            if (favPois[i] && favPois[i]!=''){
                self.savedPOI[favPois[i].ID]=true;
            }
        }
        self.getDBpois();
          

      }, function (errResponse) {
        

          });  

          
     //get all categories 
          $http.get('http://localhost:5050/Poi/Categories').then(function (response) {
          self.categories=response.data
         
      }, function (errResponse) {
        
  
          }); 
          self.byRanking=function(){
            self.showRanking(1);
          }
          self.byCategory=function(){
            self.showRanking(2);
          }
          self.showRanking= function(id){
           
            if(id==1){
          
            if(self.showRankingBoolean1==false){
               
                self.showRankingBoolean1=true;
                self.showRankingBoolean2=false;
                self.showByName=false;
               }else{
                self.showRankingBoolean1=false;
                self.showRankingBoolean2=true;
                self.showByName=false;
               }
            }
               if(id==2){
               if(self.showRankingBoolean2==true){
               
                self.showRankingBoolean2=true;
                self.showRankingBoolean1=false;
                self.showByName=false;
                return;
               }else{
               self.showRankingBoolean2=true;
               self.showRankingBoolean1=false;
                self.showByName=false;
               }}
               if(id==3){
               
                if(self.showByName==false){
               
                    self.showRankingBoolean2=false;
                    self.showRankingBoolean1=false;
                    self.showByName=true;
                   }
              else{ self.showByName=false;
                self.showRankingBoolean1=false;
                self.showRankingBoolean2=true;
            }
        }
          }
           //filter by category
           self.filterByCategory = function () { 
              self.filterCategory=self.filterCategory.catagory_id;

              
           $http.get('http://localhost:5050/Poi/PointOfInterestByCategory/'+self.filterCategory).then(function (response) {
            self.pois = response.data;
            
         }, function (errResponse) {
         
     
             }); 
            
          
            };  



        //gets the favorite poi's of the user  
        self.getDBpois=function(){             
        $http.get('http://localhost:5050/RegisteredUsers/UserPointsOfInterest').then(function (response) {

        var temp=response.data;
        var tempCount=0;
        for (var i=0; i<temp.length; i++){
            if (temp[i] && temp[i].ID){
                var poi_id=temp[i].ID
                self.savedPOI[poi_id]=true;
                tempCount++;
                
            }
        }
        if (   $scope.indxCtrl.count==0){
            $scope.indxCtrl.count=tempCount;
        }
        
        if (FavPoiService.favPois.length==0 && temp && temp[0].ID && temp.length>0 ){ //counts how many pois in favourites (in db too) AT THE START of the login
            FavPoiService.countFav=temp.length;
        }
       
        
          
         }, function (errResponse) {  
  
  
                   
           }); 


        };


            //search by name
            self.serachPoiByName=function(){
              
                $http.get('http://localhost:5050/Poi/SearchByName/'+ self.PoiName).then(function (response) {         
                self.byName = response.data[0];
                self.showRanking(3);
                 }, function (errResponse) {
                 
             
                     }); 
            }
            
            //show all categories
           self.showAllCategories = function () {     
            self.pois=self.allPois;
                self.showRanking(2)
          };  

           //save poi to favourites
         self.savePOI = function (poi_id) {  
            $scope.indxCtrl.count++;
            self.getPointOfInterestandSave(poi_id);
            
   
      };

          //delete poi from favourites
     self.deletePOI = function (poi_id) {   
        $scope.indxCtrl.count--;
        FavPoiService.deletePoi(poi_id)
        self.savedPOI[poi_id]=false;  
       // $window.alert("Point of interest number "+localStorageModel.getLocalStorage(poi_id)+" was deleted from your favourites")
        //localStorageModel.updateLocalStorage(poi_id, '');
        self.deletePoi(poi_id);

     };

             //delete poi from DB
             self.deletePoi = function (poi_id) {   
                var serverURL='http://localhost:5050';
             $http({url: serverURL + '/RegisteredUsers/DeletePointOfInterest', method: 'delete', data: {POF_id:poi_id , token:setHeadersToken.token}}).then(function (response) {
                           
               //$window.alert(response.data+"")
               FavPoiService.setSavedPoints(self.savedPoints);
               self.getFavouritePoiAmount();  //update amount

                    
         }, function (errResponse) {
   
           // $window.alert(errResponse.data);
          });   
          
   
         }; 

       //gets the favorite poi amount
       self.getFavouritePoiAmount = function () {   
           
        self.poiAmountMSG='You currently have '+$scope.indxCtrl.count+' points in your favourite list!';
        /*
        $http.get('http://localhost:5050/RegisteredUsers/PointsOfInterestsAmount').then(function (response) {
        
         self.poiAmountMSG=response.data+"";
        
    
       }, function (errResponse) {
        

         });     
         */
       };

       self.showCat=function(poiID){
        self.showDetails(poiID);
        self.showMap=false;
        if(self.map !== undefined || self.map !== null) {
          self.map.remove();
        }

    }
      self.showDetails= function(poiID){
      
      var addViewers=false;
      self.reviews1=null
      self.reviews2=null;
      self.date1=null;
      self.date2=null;
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
        self.currentPoi.NumberOFViewers=response.data[0].NumberOFViewers;
       if (response.data[1]){
           self.reviews1=response.data[1].ReviewDescription;
           self.date1=response.data[1].date+"";
       }
   
       if (response.data[2]){
           self.reviews2=response.data[2].ReviewDescription;
           self.date2=response.data[2].date+"";
       }
     
       
    }, function (errResponse) {

        });
      }
    } 


         //get poi details by poi_id
         self.getPointOfInterestandSave = function (poi_id) { 
            
         $http.get('http://localhost:5050/Poi/PointOfInterestInfo/'+poi_id).then(function (response) {
          self.poiTobeSaved=response.data;
          var poi=self.poiTobeSaved;
          self.savedPOI[poi_id]=true; 
         // localStorageModel.addLocalStorage(poi_id,poi_id);
          FavPoiService.addPoi(poi)
         // $window.alert("Point of interest number "+localStorageModel.getLocalStorage(poi_id)+" was added to your favourites")
          self.getFavouritePoiAmount();  //update amount
          
       }, function (errResponse) {
       
   
           }); 
          
        
          }; 

}]);