 var tangoApp = angular.module('tango');
 tangoApp.factory('Deadlines', function($http,$rootScope){
 	return {
    	retrieveDeadlines : function() {
        	return $http.get('/gatherConfData');
    	},
    	subDLPassed : function() {
          return $rootScope.submissionDeadlinePassed;
      	},
      	reviewDLPassed : function() {
      		return $rootScope.reviewDeadlinePassed;
      	},
      	saveDeadlines : function(subDL,reviewDL) {
      		$rootScope.submissionDeadlinePassed = subDL;
      		$rootScope.reviewDeadlinePassed = reviewDL;
      	},
 	}

 });

 // tangoApp.controller('DeadlinesCtrl', function($scope,$rootScope) {
 // 	var datenow = new Date();
 // 	$rootScope.submissionDeadlinePassed=false;
 // 	$rootScope.reviewDeadlinePassed=false;

 //        $scope.retrieveDeadlines = function() {
 //        	$http.get('/gatherConfData')
 //        	.success(function(data){
 //        		if(new Date(data[0].submissionDeadline) < datenow)
 //        			$rootScope.submissionDeadlinePassed=true;
 //        		if(new Date(data[0].reviewDeadline) < datenow)
 //        			$rootScope.reviewDeadlinePassed=true;

 //        		console.log('Success!');
 //        	})
 //        	.error(function(data) {
 //        		console.log('Error: ' + data);
 //        	});
 //        };

 //        $scope.subDLPassed = function() {
 //          return $rootScope.submissionDeadlinePassed;
 //      };

 //      $scope.reviewDLPassed = function() {
 //      	return $rootScope.reviewDeadlinePassed;
 //      };
 //  });
