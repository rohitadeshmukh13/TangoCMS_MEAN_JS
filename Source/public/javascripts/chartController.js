'use strict';
/**
 * @ngdoc function
 * @name TangoApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller for the pie chart on Conference Dashboard
 */
angular.module('tango')
  .controller('ChartCtrl', ['$scope','$timeout','$http', function ($scope,$timeout,$http) {
    
    $scope.pie = {
        labels :['Completed Papers','Accepted Papers','Rejected Papers'],
        data:[]
    };
    $http.get('/api/paperstats').success(function(data){
      $scope.pie.data.push(data.Completed);
      $scope.pie.data.push(data.Accepted);
      $scope.pie.data.push(data.Rejected);
       console.log($scope.pie);
    }).error(function(data) {
                        console.log('Error: ' + data);
                });

    
/* In case donut looks better than pie
    $scope.donut = {
        labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
        data: [300, 500, 100]
    };
  */

  
}]);