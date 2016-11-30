'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('tango')
	.directive('headerNotification',['auth',function(){
		return {
        templateUrl:'javascripts/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
        controller:function($scope,auth){
        	$scope.loggedinUsername=auth.currentUser();
        }
        }
	}]);


