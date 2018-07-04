angular.module('citiesApp')
.controller('favouritePoiController', ['$http', '$window','$scope','setHeadersToken','FavPoiService', function ($http, $window,$scope,setHeadersToken,FavPoiService) {

       var self = this;
       self.userPois=[];  //the pois that are shown on the screen
       self.wantToOrder=false;
       self.countOrder=0;
       self.poisOrder=[];
       self.POF_ids=[];  //the poi's in the order in which the user has chosen.
       self.tmpOrder=[];
       self.commentPois=[];
       self.currentRank='';
       self.currentReview='';
       self.tmpID='';
       self.savedPoints=[];
       self.currentlySaved=[]; //makes sure that the save button is shown only for un-saved points.
       self.showRankingBoolean1==false;
       self.showRankingBoolean2=false;
       self.showRankingBoolean3=true;
       self.showRankingBoolean4=false;
       self.currentPoi='';
       self.reviews1='';
       self.reviews2='';
       self.date1='';
       self.date2='';
       self.showPOI=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
       
       //gets the favorite poi's of the user               
        $http.get('http://localhost:5050/RegisteredUsers/UserPointsOfInterest').then(function (response) {

        
          var savedPois=response.data;
          var x=FavPoiService.favPois;
          self.userPois = x.concat(response.data);
     
          self.setSavedPoints(savedPois);
          self.removeEmptyCells();
          self.removeDuplicate();
        

       }, function (errResponse) {  // it will get here if the user has no saved points at first


           self.x=FavPoiService.favPois;
           self.userPois=self.x;
          self.removeEmptyCells();
          self.removeDuplicate();

          
          
         }); 


         //set saved points 
         self.setSavedPoints = function (savedPois) { 

            for(var i=0; i<savedPois.length; ++i) {
                if (savedPois[i]){
                var poi_id=savedPois[i].ID;
                self.currentlySaved[poi_id]=poi_id;
                }
            }
        };

         
        //remove duplicates from the pois' array
         self.removeDuplicate = function () { 

            for(var i=0; i<self.userPois.length; ++i) {
                for(var j=i+1; j<self.userPois.length; ++j) {
                    if(self.userPois[i].ID == self.userPois[j].ID)
                    self.userPois.splice(j--, 1);
                }
            }
        
        };

        self.removeEmptyCells = function () { 
            var count=0;
            var indexes=[];
            for (var i = 0; i < self.userPois.length; i++) {
              if (self.userPois[i] == '') {         
                self.userPois.splice(i, 1);
                i--;
              }
            }

            for (var i = 0; i < self.userPois.length; i++) {
                if (!self.userPois[i]) {         
                  continue;
                }
                else{
                    indexes[count]=i;
                    count++;
                    
                }
              }

           var j=0;
           var temp=[];
            for (var i = 0; i < count; i++) {
             temp[i]=self.userPois[indexes[j]];
             j++;
              }
               self.userPois=temp;
          
          };
         
            //order po's manually by user
            self.OrderPointsOfInterestManually = function () { 
             if (self.POF_ids.length==self.userPois.length){ //if the user has chosen all the poi's

             if(document.getElementById("orderCheckbox").checked == true){
                document.getElementById("orderCheckbox").checked = false;
            }
            else{
                document.getElementById("orderCheckbox").checked = true;
            }
            self.showRankingBoolean1=false;
            self.showRankingBoolean2=false;
             $http.post('http://localhost:5050/RegisteredUsers/OrderPointsOfInterestManually',{POF_ids : self.POF_ids, token:setHeadersToken.token} ).then(function (response) {
              
                self.wantToOrder=false;
                self.POF_ids=[];
                self.countOrder=0;
                self.poisOrder=[];
                self.tmpOrder=[];

                self.OrderedPointsOfInterest();
                
           }, function (errResponse) {
           
           

               }); 
            }
            else {
            $window.alert('Please choose ALL your points of interests')

            }
            
              }; 

            //get ordered Points of Interests
            self.OrderedPointsOfInterest = function () { 
       
             $http.get('http://localhost:5050/RegisteredUsers/OrderedPointsOfInterest').then(function (response) {
                 

              self.userPois=response.data;  


              }, function (errResponse) {
              
                  }); 
                 

                 };
               
                self.byCategory=function(){
                    self.showRanking(2);
                  }
                  self.byRanking=function(){
                    self.showRanking(1);
                  }
                  self.showRanking= function(id){
                   
                    if(id==1){
                
                    if(self.showRankingBoolean1==false){
                       
                        self.showRankingBoolean1=true;
                        self.showRankingBoolean2=false;
                        self.showRankingBoolean3=false;
                        document.getElementById("categoryCheck").checked = false;
                      //  self.wantToOrder=false;
                       
                       }else{
                        self.showRankingBoolean2=false;
                        self.showRankingBoolean1=false;
                        self.showRankingBoolean3=true;
                        document.getElementById("rankCheck").checked = false;
                        document.getElementById("categoryCheck").checked = false;
                     //   if( document.getElementById("rankCheck").checked = true){
                       //     document.getElementById("rankCheck").checked = false;
                       // }
                       }
                    
                     } if(id==2){
                      
                       if(self.showRankingBoolean2==false){
                       
                        self.showRankingBoolean2=true;
                        self.showRankingBoolean1=false;
                        self.showRankingBoolean3=false;
                        document.getElementById("rankCheck").checked = false;
                       // self.wantToOrder=false;
                       // if( document.getElementById("rankCheck").checked = true){
                       //     document.getElementById("rankCheck").checked = false;
                      //  }
                        
                       }else{
                       self.showRankingBoolean1=false;
                       self.showRankingBoolean2=false;
                       self.showRankingBoolean3=true;
                       document.getElementById("categoryCheck").checked = false;
                       document.getElementById("rankCheck").checked = false;
                       //self.showRankingBoolean1=false;
                       }
                    }
                    }; 
                    self.showDetails= function(index,poiID){
                        self.reviews1=null
                        self.reviews2=null;
                        self.date1=null;
                         self.date2=null;
                        var addViewers=false;
                        
                          if (self.showPOI[poiID]==false){
                  
                            var i;
                            for (i = 0; i < self.showPOI.length; i++) { 
                            self.showPOI[i]=false;
                              }
                    
                              for(var j=0;j<self.userPois.length;j++){
                                  
                                if(self.userPois[j].ID==poiID){
                                    self.currentPoi=self.userPois[j];
                                   
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
            //the user wants to order his poi's
            self.wantToOrderFunc = function () { 
              
               if (self.wantToOrder==false){
                self.wantToOrder=true;
                self.countOrder=0;
                self.showRankingBoolean1=false;
                self.showRankingBoolean2=false;
                document.getElementById("categoryCheck").checked = false;
                document.getElementById("rankCheck").checked = false;
                
               }
                  else{
                    self.wantToOrder=false;

                  }
            };
          
           self.selectedBtn=function(id){
                if(self.tmpOrder[id]==id){
                    return false;
                }
                return true;
           }
              //order goes up by one
              self.raiseIndex = function (id) { 
                self.POF_ids[self.countOrder]=id;
                self.countOrder=self.countOrder+1;
                self.poisOrder[id]=self.countOrder;
                self.tmpOrder[id]=id;
            
            }

              //open comment dialog for a poi
              self.openCommentDialog = function (poiID) { 
                self.commentPois=[];
                self.commentPois[poiID]=true;
                self.tmpID=poiID;
   
                };

             //rank poi
             self.rankPoi = function (POF_id) { 
                if (self.currentRank && self.currentRank!=""){
                $http.post('http://localhost:5050/RegisteredUsers/GiveRank', {POF_id: POF_id, Rank:self.currentRank }).then(function (response) {
                    
   
               $window.alert("Ranked successfuly!")
   
   
                 }, function (errResponse) {
                    $window.alert(errResponse.data);

                     }); 
                    
                    }
                    else{
                        $window.alert('Please chose a rank first');

                    }

                    };

              //review poi      
             self.reviewPoi = function (POF_id) { 
                if (self.currentReview && self.currentReview!=""){
                $http.post('http://localhost:5050/RegisteredUsers/GiveReview', {POF_id: POF_id, Review:self.currentReview}).then(function (response) {
                    
   
               $window.alert("Reviewd successfuly!")
   
   
                 }, function (errResponse) {
                    $window.alert(errResponse.data);

                     }); 
                    }
                    else{
                        $window.alert('Please write a review first!');

                    }

                    };

            //show all categories
           self.showAllCategories = function () {     
            self.pois=self.allPois;
                self.showRanking(2)
          };  


          //shows or  hides the save button for a poi
           self.showSavebutton = function (poi_id) {     
            self.currentlySaved[poi_id] = poi_id;

          };  

          

           //save poi to favourites
         self.savePOI = function (poi_id) {   
   
          $http.post('http://localhost:5050/RegisteredUsers/SavePointOfInterest', {POF_id:poi_id , token:setHeadersToken.token}).then(function (response) {
                        
            $window.alert(response.data+"")
            self.savedPoints[poi_id]=poi_id;    
            FavPoiService.setSavedPoints(self.savedPoints);
           
            self.showSavebutton(poi_id);
                    

      }, function (errResponse) {
     

       });   
       

      };  

         //delete poi from favourites
         self.deletePoi = function (poi_id) {   
             var serverURL='http://localhost:5050';
          $http({url: serverURL + '/RegisteredUsers/DeletePointOfInterest', method: 'delete', data: {POF_id:poi_id , token:setHeadersToken.token}}).then(function (response) {
                        
            $window.alert(response.data+"")
            self.savedPoints[poi_id]='';   
            FavPoiService.setSavedPoints(self.savedPoints);
            self.currentlySaved[poi_id] = null;

            //add to hanen
            FavPoiService.favPois[poi_id]='';
            FavPoiService.countFav--;
            $scope.indxCtrl.count--;
            

            //delete the favourite point from the list in the moment we delete it 
            var index=0;
            for (var i=0; i<self.userPois.length; i++){

                if (self.userPois[i].ID==poi_id){ //find the point and delete it from least
                    self.userPois[i]='';
                }
            }
            self.removeEmptyCells();   // remove empty cells

       
                    
      }, function (errResponse) {

         $window.alert(errResponse.data);
       });   
       

      };  
               
}]);