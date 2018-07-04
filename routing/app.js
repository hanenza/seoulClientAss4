let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
            templateUrl: 'components/Home/home.html',
            controller : 'homeController as homeController'
    })
        .when('/about', {
            templateUrl: 'components/About/about.html',
        })
       
       
        .when('/register', {
            templateUrl: 'components/Register/register.html',
            controller : 'registerController as registerController'
        })
      
        .when('/POI', {
            templateUrl: 'components/POI/poi.html',
            controller : 'poiController as poiController'
        })
        .when('/favouritePOI', {
            templateUrl: 'components/favouritePOI/favouritePOI.html',
            controller : 'favouritePoiController as favouritePoiController'
        })
        .otherwise({ redirectTo: '/' });

        
}]);










