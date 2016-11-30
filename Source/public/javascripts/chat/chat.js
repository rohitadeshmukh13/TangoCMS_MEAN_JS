'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('tango')
	.directive('chat',function(){
		return {
        templateUrl:'javascripts/chat/chat.html',
        restrict: 'E',
        replace: true,
    	}
	});


