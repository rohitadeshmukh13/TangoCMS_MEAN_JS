'use strict';
/**
 * @ngdoc function
 * @name tango.controller:UserpwdCtrl
 * @description
 * # UserPwdCtrl
 * User password Controller of the tangoconf app
 */
 var app = angular.module('userModule',['tango']);
 // angular.module('tango',[])
 app.factory('Userspwd', function($http){
   return {
   
     updateUserpassword : function(id,userdata){
     return $http.put('/updateuserpwd/' +id,userdata);
  },
  
  }
  
  });
  
  


  app.controller('UserspwdCtrl', ['$scope','$state','Userspwd','auth',function($scope,$state,Userspwd,auth){
  
  $scope.formData = {};
  $scope.userdata = {};
  $scope.passwordcheck=false;
      		
	
  $scope.updateUserpassword = function(id) {
    
    if($scope.userdata.repeatpassword==$scope.userdata.password){

      Userspwd.updateUserpassword(auth.currentUserIid(),$scope.userdata).error(function(error) {
                      $scope.error = error;
                 }).then(function(){
					  $state.go('login');
				});
        };
    $scope.passwordcheck=true;
    console.log($scope.passwordcheck);
    $state.go('home.editpassword');
   
 
	}
  

}]);