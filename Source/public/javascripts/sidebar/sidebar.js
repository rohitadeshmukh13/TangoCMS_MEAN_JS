'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('tango')
  .directive('sidebar',['$location','$http','auth','Deadlines',function() {
    return {
      templateUrl:'javascripts/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope,$http,auth,Deadlines){
        var loggedInUser=auth.currentUserID();
        console.log(loggedInUser); 
        $scope.isChairman=false;
        console.log("Before call"+$scope.isChairman);
        $http.get('/checkConForchair/'+loggedInUser).success(function(data){
            if(data.length>0)
              $scope.isChairman=true;
            console.log("Cha");
        });
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
        
        $scope.check = function(x){
          
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };

      $scope.submissionDeadlinePassed = Deadlines.subDLPassed();
      $scope.reviewDeadlinePassed = Deadlines.reviewDLPassed();

      }
    }
  }]);
