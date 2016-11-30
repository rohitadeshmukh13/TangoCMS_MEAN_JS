'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('tango')
	.directive('taskspreview',function(){
		return {
        templateUrl:'javascripts/notifications/notifications.html',
        restrict: 'E',
        replace: true,
    	}
	});


