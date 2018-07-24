angular.module('citiesApp')
.controller('registerController', ['$http', '$location', '$window','$scope',
    function ( $http, $location, $window,$scope) {
        var self = this;
        self.userDetails = { UserName:'', FirstName: '', LastName: '',Password: '', City: '', Country: '', Email: '',Categories:[], Questions: [],Answers:[]};
        var allCatagories=[]
        self.userDetails.Categories=allCatagories;
        //self.mycountries={};
        //var myCounrty="Israel";
        //self.userDetails.Country=myCounrty;
        //self.userDetails.Categories=allCatagories;



        

         $http.get('http://localhost:5050/POI/Categories').then(function (response) {
              self.myCategories=response.data 
         
            // self.getMyCountries();
        })
        $http.get('http://localhost:5050/Users/Countries').then(function (response) { 
           self.mycountries=response.data;

           self.getQuestions();
        
        })

        self.getQuestions = function () {    
          
            $http.get('http://localhost:5050/Poi/Questions').then(function (response) {
              self.questions=response.data;
             
            
                      
          }, function (errResponse) {
            
          
  
              });
  
              };

       self.register = function (valid) {   
    
        var question1=self.userDetails.Questions[0];
        var question2=self.userDetails.Questions[1];
/*
        if (question1=='What is your nickname?'){
            question1='1';
        }
        if (question2=='What is your nickname?'){
            question2='1';
        }
        if (question1=="What is your mother's name?"){
            question1='2';
        }
        if (question2=="What is your mother's name?"){
            question2='2';
        }
        if (question1=="What is your father's name?"){
            question1='3';
        }
        if (question2=="What is your father's name?"){
            question2='3';
        }
        if (question1=="What is your pet's name?"){
            question1='4';
        }
        if (question2=="What is your pet's name?"){
            question2='4';
        }
*/
        self.userDetails.Questions[0]=question1.QuestionID;
        self.userDetails.Questions[1]=question2.QuestionID;
        self.userDetails.Country = self.userDetails.Country.Name; 
        $http.post('http://localhost:5050/Users/Register',self.userDetails).then(function (response) {
            
          //  var returnData = response.data;
         //   if (returnData == 'true') {
           //     self.userDetails.Country = self.userDetails.Country.Name;}
           
           if (response.data=='Registered succsefuly!'){
            $window.alert(response.data+"");
            $scope.indxCtrl.count=0;
            /*
            $scope.indxCtrl.userName= self.userDetails.UserName;
            $scope.indxCtrl.isLoggedin=true;

                        */
            $location.path('/');

           }
           else{
            $window.alert(response.data+"")
           
           }
            
           
         }, function (errResponse) {
        // $window.alert("wrong");
        $window.alert(errResponse.data)
        });
    
        };
      
        $scope.toggleSelection = function toggleSelection(event) {    
            if(event.target.checked){
                allCatagories.push(event.target.id);
            }
        // $window.alert (event.target.id);
        //  myCounrty=event.target.Name;
          };
    }]);
   
    