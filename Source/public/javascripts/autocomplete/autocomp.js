var app = angular.module('autocomp', ['autocomplete']);

// the service that retrieves some object title from an url
app.factory('ObjectRetriever', function($http, $q, $timeout){
  var ObjectRetriever = new Object();

  ObjectRetriever.getobjects = function(obj) {
    var objectdata = $q.defer();
    //var objects;

    //var objects = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

    // var moreObjects = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

    // if(i && i.indexOf('T')!=-1)
    //   objects=moreObjects;
    // else
    //   objects=moreObjects;

    $timeout(function(){
      objectdata.resolve(obj);
    },1000);

    return objectdata.promise
  }

  return ObjectRetriever;
});

// app.controller('AutoCompCtrl', function($scope, ObjectRetriever){

//   $scope.objects = ObjectRetriever.getobjects("...");
//   $scope.objects.then(function(data){
//     $scope.objects = data;
//   });

//   $scope.getobjects = function(){
//     return $scope.objects;
//   }

//   $scope.doSomething = function(typedthings){
//     console.log("Do something like reload data with this: " + typedthings );
//     $scope.newobjects = ObjectRetriever.getobjects(typedthings);
//     $scope.newobjects.then(function(data){
//       $scope.objects = data;
//     });
//   }

// }
// );