'use strict';
/**
 * @ngdoc function
 * @name tango.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the Tango app
 */
angular.module('tango')
  .controller('MainCtrl', function($scope,$position) {
    $scope.testval='TEST';
  });
