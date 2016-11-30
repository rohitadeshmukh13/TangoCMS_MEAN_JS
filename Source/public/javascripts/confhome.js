'use strict';
/**
 * @ngdoc function
 * @name tango.controller:ConfCtrl
 * @description
 * # ConfCtrl
 * Conference Controller of the Tango app - For all operations related to conference module
 */
angular.module('tango')
  .factory('conference', ['$http','$window', function($http,$window){
    var conference={
      confs:[],
      possiblechairs:[]
    };

    //fetches all conferences
  conference.gatherConfData = function(){
     return $http.get('/gatherConfData').success(function(data){
      angular.copy(data,conference.confs);
     });
  };

  //brings one conference document based on passed ID
  conference.getSingleConfdata=function(conid){
    console.log(conid);
    return $http.get('/getconfdata/'+conid).success(function(data){
      console.log(data);
      angular.copy(data,conference.confs);

    });

  };

  //PUT call to update the provided details of a selected conference(confid)
  conference.updateconfdata = function(confdata,origconf){
    console.log(conference);

     return $http.put('/updateconfdata/'+origconf._id,confdata);

  };

  conference.fetchUsersForChairman=function(){
    return $http.get('/getAllUsers').success(function(data){
      angular.copy(data,conference.possiblechairs)
    })

  };



    return conference;
      
    }

  ]);


angular.module('tango').controller('ConfCtrl', ['$scope','$state','conference','Deadlines','$http', function($scope,$state,conference,Deadlines,$http){
  
  $scope.conference=conference.confs;
  $scope.possiblechairs=conference.possiblechairs;
    $scope.confdata={};
  

  
  //calls the updateconfdata factory method and transitions view to dashboard on success
 $scope.updateConfdata=function(){
          conference.updateconfdata($scope.confdata,$scope.conference).error(function(error){
      $scope.error=error;
    }).then(function(){

      // after updateconfdata, retrieve the deadlines from db
      var datenow = new Date();
      var submissionDeadlinePassed=false;
      var reviewDeadlinePassed=false;

      $http.get('/gatherConfData')
          .success(function(data){
            if(new Date(data[0].submissionDeadline) < datenow)
              submissionDeadlinePassed=true;
            if(new Date(data[0].reviewDeadline) < datenow)
              reviewDeadlinePassed=true;

            Deadlines.saveDeadlines(submissionDeadlinePassed,reviewDeadlinePassed);

            console.log('Success!');
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
       
      //$state.go('home.dashboard');
      $state.go('home.dashboard', {}, {reload: true});
    })

  };

  //Invoked when user selects to make changes to a particular conference, passed id to retrieve specific details
  $scope.getSingleConfdata=function(conid){
    console.log(conid);
    conference.getSingleConfdata(conid).error(function(error){
      $scope.error=error;
    }).then(function(){
      conference.fetchUsersForChairman().error(function(error){
        $scope.error=error;
      }).then(function(){
      $state.go('home.confdetails');
      })
    })

  };

 
}
]);