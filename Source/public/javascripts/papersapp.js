'use strict';
/**
 * @ngdoc function
 * @name tango.controller:PaperCtrl
 * @description
 * # PaperCtrl
 * Paper Controller of the Tango app - For all operations related to papers module
 */
angular.module('papersModule',['userModule','autocomplete','autocomp','ngFileUpload']).factory('paper', ['$http','$window', function($http,$window){
	 var paper={
      paps:[],
    };
    //Brings all papers stored to display in chairman's page [unused as of now]
    paper.getAllPapers = function(){
     return $http.get('/api/papers').success(function(data){
        console.log(data);
      angular.copy(data,paper.paps);
     });
  };

  //Calls an API to update PaperSchema with the selected user as Reviewer
  paper.assignAReviewer=function(paperid,paperobj){
    return $http.put('/assignReviewer/'+paperid,paperobj);
  };

  paper.getAllAuthors = function(){
     return $http.get('/getAllAuthors').success(function(data){
        console.log(data);
      angular.copy(data,paper.paps);
     });
  };
  paper.getAllReviewers = function(){
     return $http.get('/getAllReviewers').success(function(data){
        console.log(data);
      angular.copy(data,paper.paps);
     });
  };
  
    return paper;

  }
  ]);


angular.module('papersModule').controller('PapersCtrl', ['$scope','$state','$http','$rootScope','ObjectRetriever','auth','Upload','$timeout','Users','paper','Deadlines',function($scope,$state,$http,$rootScope,ObjectRetriever,auth,Upload,$timeout,Users,paper,Deadlines){
  
	 //as28tuge starts
  $scope.assignData={};
  var reviewdata={
      userList:[]
    };

    
  // when landing on the page, get all papers and show them
        $http.get('/api/papers')
                .success(function(data) {
                        $scope.papers = data;
                        console.log($scope.papers);
                       Users.fetchAllUsers().success(function(data){
                        angular.copy(data,reviewdata.userList);
                       });

                        $scope.possibleReviewers=reviewdata.userList;
                        console.log($scope.possibleReviewers);
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
  
 
  $scope.assignReviewer=function(paperobj){
          
          paper.assignAReviewer(paperobj._id,paperobj).success(function(data){
            console.log("Data from assigning"+data);
            }).then(function(){
                   $state.reload();
    });

  };
  $scope.getAllPapersForChair = function(){
                $http.get('/api/papers').success(function(data) {
                            console.log("Now"+data);
                                $scope.mypapers = data;
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };
 //as28tuge ends

  //Prashanth's part starts
  $scope.papersForAuthors=paper.paps;
  $scope.papersForReviewer=paper.paps;
  $scope.getAllAuthors=function(){
        paper.getAllAuthors().error(function(error){
            $scope.error=error;
        }).then(function(){
            $state.go("home.authors");
        })
  };
  $scope.getAllReviewers=function(){
        paper.getAllReviewers().error(function(error){
            $scope.error=error;
        }).then(function(){
            $state.go("home.reviewers");
        })
  };
  //Prashanth's part ends
  var currUserID = auth.currentUserID();
  $scope.fileurl = "#";
  $scope.globalErrFlag = false;
  $scope.submissionDeadlinePassed = Deadlines.subDLPassed();
  $scope.reviewDeadlinePassed = Deadlines.reviewDLPassed();

        $scope.getAllPapers = function(id) {
            $http.get('/api/papers')
                .success(function(data) {
                        $scope.papers = data;
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
        };

        $scope.getMyPapers = function() {
                $http.get('/api/mypapers/' + currUserID)
                        .success(function(data) {
                                $scope.mypapers = data;
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        $scope.getPaper = function(paper_id) {
                $http.get('/api/papers/' + paper_id)
                        .success(function(data) {
                                $scope.thepaper = data;
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        $scope.createPaper = function() {
                $http.post('/api/papers', $scope.formData)
                        .success(function(data) {
                                $scope.paper = data;
                                if(typeof $scope.paperfile != 'undefined' && $scope.paperfile != null){
                                    $scope.uploadFile($scope.paperfile,data._id);
                                }
                                $state.go('home.listMySubs');
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        $scope.updatePaper = function(id) {
                //$scope.formData.updatedAt = Date.now;
                if(typeof $scope.formData.title == 'undefined' || $scope.formData.title == null 
                    || $scope.formData.title =="")
                {
                    $scope.globalErrFlag = true;
                    return;
                }

                if(typeof $scope.paperfile != 'undefined' && $scope.paperfile != null){
                    $scope.formData.filename = $scope.paperfile.name;
                }

                $http.put('/api/papers/' + id, $scope.formData)
                        .success(function(data) {
                                $scope.paper = data;
                                if(typeof $scope.paperfile != 'undefined' && $scope.paperfile != null){
                                    $scope.deleteFile(data._id);
                                    $scope.uploadFile($scope.paperfile,data._id);
                                }
                                $state.go('home.viewSub');
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        // delete a paper after checking it
        // id is the paper id
        $scope.deletePaper = function(id) {
                $http.delete('/api/papers/' + id)
                        .success(function(data) {
                            if(typeof $scope.paper.filename != 'undefined'){
                                $scope.deleteFile(id);
                            }
                                console.log('Success!');
                                $state.go('home.listMySubs');
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };


        $scope.selectedFiles = [];
        $scope.dataUrls = [];

        $scope.onFileSelect = function($files) {

            $scope.selectedFiles['selectedfile'] = $files[0];

            var $file = $files[0];
            if (window.FileReader && $file.type.indexOf('selectedfile') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[0]);

                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.dataUrls['selectedfile'] = e.target.result;
                    });
                }
            }    
        }

        $scope.uploadFile =  function(file,paper_id){

            Upload.upload({
              data: {paper_id: paper_id},
              url: 'api/upload',
              file: $scope.selectedFiles['selectedfile']

          }).then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });
      }


        $scope.downloadFile = function(paper_id) {
            $scope.fileurl = "/api/download/" + paper_id;
        }

        // delete the attachment after deleting the paper
        $scope.deleteFile = function(paper_id) {
                $http.delete('/api/deletefile/' + paper_id)
                        .success(function(data) {
                                console.log('Success!');
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        // --------------------------------------------------------------

        $scope.savePaper = function(paper) {
            paper.status =  "Incomplete";
            if (paper.title != null && paper.title != "" && paper.abstract != null 
                && paper.abstract != "" && paper.filename != null && paper.filename != "")
            {
                paper.status = "Completed";
            }

            $rootScope.ppr = paper;
        };

        $scope.getPaper = function() {
            //$scope.formData = $rootScope.ppr;
            var temp = JSON.parse(JSON.stringify($rootScope.ppr)); // only return copy of object, not ref
            return temp;
        };

        $scope.usernames = [];
        $scope.formData = new Object();
        var j = 0;
        $scope.formData.authors = [];
        $scope.formData.authorIDs = [];

        Users.fetchAllUsers()
                .success(function(data) {
                        $scope.users = data;
                        for (var i = 0; i < data.length; i++) {
                             $scope.usernames[i] = $scope.users[i].username;
                        }
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });

        // gives another object array on change
        $scope.updateObjects = function(){
            // ObjectRetriever could be some service returning a promise
            $scope.newobjects = ObjectRetriever.getobjects($scope.usernames);
            $scope.newobjects.then(function(data){
                $scope.objects = data;
            });

            j = $scope.formData.authors.length;
            if(typeof $scope.formData.authorIDs === 'undefined' || $scope.formData.authorIDs === null){
                $scope.formData.authorIDs = [];
            }
            for (var i = 0; i < $scope.users.length; i++) {
                if($scope.selected == $scope.users[i].username){
                    $scope.formData.authors[j] = $scope.users[i];
                    $scope.formData.authorIDs[j++] = $scope.users[i]._id;
                    $scope.selected = "";
                }
            }
        }

        $scope.deleteAuthor = function(author){
            var index=$scope.formData.authors.indexOf(author);
            j = $scope.formData.authors.length;
            if(typeof $scope.formData.authorIDs === 'undefined' || $scope.formData.authorIDs === null){
                $scope.formData.authorIDs = [];
            }
            $scope.formData.authors.splice(index,1); 
            $scope.formData.authorIDs.splice(index,1);
            j--; 
        }

        $scope.prepCreatePaper = function(){
            if(typeof $scope.formData.title == 'undefined' || $scope.formData.title == null 
                || $scope.formData.title =="")
            {
                $scope.globalErrFlag = true;
                return;
            }

            if(typeof $scope.paperfile != 'undefined' && $scope.paperfile != null){
                $scope.formData.filename = $scope.paperfile.name;
            }

            Users.searchById(currUserID)
                .success(function(data) {
                    // $scope.formData.creator = data._id;
                    $scope.formData.creator = data;
                    // creator is also an author; so if the author's list doesn't contain creator as author, add it
                    var indx = $scope.formData.authorIDs.indexOf($scope.formData.creator._id);
                    if(indx == -1)
                        $scope.formData.authors.push($scope.formData.creator);

                    $scope.createPaper();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }

        // $scope.mouseHoverIn = function(){
        //     this.flag = true;
        // };

        // $scope.mouseHoverOut = function(){
        //     this.flag = false;
        // };

        $scope.checkInput = function(input){
            if(input == null || input == "")
                this.errflag = true;
            else
                this.errflag = false;
        };

 
}
]);