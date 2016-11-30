'use strict';
/**
 * @ngdoc function
 * @name tango.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the Tango app
 */
//  angular.module('reviewsModule',[])
//  .factory('Review', function($http){
//    return {
//   }
// });

  angular.module('reviewsModule',['tango','userModule'])

  .controller('ReviewsCtrl', ['$scope','$http','$rootScope','auth','Users','$state','Deadlines',
    function($scope,$http,$rootScope,auth,Users,$state,Deadlines){
  
  var currUserID = auth.currentUserID();
  $scope.fileurl = "#";
  $scope.submissionDeadlinePassed = Deadlines.subDLPassed();
  $scope.reviewDeadlinePassed = Deadlines.reviewDLPassed();

        $scope.getAssignedSubs = function(id) {
            $http.get('/api/assignedsubs/' + currUserID)
                .success(function(data) {
                        $scope.assignedSubs = data;
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
        };

        // $scope.getSubForReview = function(paper_id) {
        //     Papers.getPaper(paper_id)
        //         .success(function(data) {
        //                 $scope.sub = data;
        //         })
        //         .error(function(data) {
        //                 console.log('Error: ' + data);
        //         });
        // }

        $scope.getPaper = function(paper_id) {
                $http.get('/api/papers/' + paper_id)
                        .success(function(data) {
                                $scope.sub = data;
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        $scope.updatePaperStatus = function(paper_id,paperStatusObj) {
                $http.put('/api/paperstatus/' + paper_id, paperStatusObj)
                        .success(function(data) {
                                //$scope.sub = data;
                                console.log('Success!');
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };        

        $scope.createReview = function() {
                $http.post('/api/reviews', $scope.reviewData)
                        .success(function(data) {
                                $scope.currReview = data;
                                var paperStatusObj={
                                    paperStatus: $scope.reviewData.forSubmission.status
                                };
                                $scope.updatePaperStatus($scope.reviewData.forSubmission._id,
                                    paperStatusObj);
                                $state.go('home.listMyReviews');
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        $scope.getMyReviews = function() {
            $http.get('/api/reviews/' + currUserID)
                .success(function(data) {
                        $scope.myReviews = data;
                        console.log($scope.myReviews);
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
        };

        $scope.updateReview = function(id) {
                $http.put('/api/reviews/' + id, $scope.reviewData)
                        .success(function(data) {
                                $scope.currReview = data;
                                var paperStatusObj={
                                    paperStatus: $scope.reviewData.forSubmission.status
                                };
                                $scope.updatePaperStatus($scope.reviewData.forSubmission._id,
                                    paperStatusObj);
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };


        $scope.downloadFile = function(paper_id) {
            $scope.fileurl = "/api/download/" + paper_id;
        }


        // --------------------------------------------------------------

        $scope.saveObject = function(object) {
            $rootScope.object = object;
        };

        $scope.getObject = function() {
            var temp = JSON.parse(JSON.stringify($rootScope.object)); // only return copy of object, not ref
            return temp;
        };

        $scope.saveAndGoToNextState = function(sub) {
            if(sub.status == 'Accepted' || sub.status == 'Rejected'){
                // already reviewed
                $state.go('home.listMyReviews');
            }else{
                $scope.saveObject(sub);
                $state.go('home.viewSubForReview');
            }
        };

        $scope.globalErrFlag = false;

        $scope.prepCreateReview = function(){

            if(($scope.reviewData.forSubmission.status != 'Accepted' 
                && $scope.reviewData.forSubmission.status != 'Rejected')
                || (typeof $scope.reviewData.reviewerExpertise == 'undefined')
                || (typeof $scope.reviewData.overallEvaluation == 'undefined'))
            {
                $scope.globalErrFlag = true;
                return;
            }
            
            Users.searchById(currUserID)
                .success(function(data) {
                    $scope.reviewData.reviewer = data;
                    
                    $scope.createReview();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
        //Prashanth's part starts
         $scope.getAllReviews = function() {
            $http.get('/getAllreviews')
                .success(function(data) {
                        $scope.allReviews = data;
                        console.log($scope.allReviews);
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
        };
        //Prashanth's part ends

}]);

