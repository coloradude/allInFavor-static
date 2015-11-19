app.controller('CreateController', ['$scope', '$location','$http','$cookies', function($scope, $location, $http, $cookies) {
  $scope.optionLimit = 2;
   $scope.options = [{for: 'option_1', label: 'Option 1', id:'option_1'},
                    {for: 'option_2', label: 'Option 2', id:'option_2'},
                    {for: 'option_3', label: 'Option 3', id:'option_3'},
                    {for: 'option_4', label: 'Option 4', id:'option_4'},
                    {for: 'option_5', label: 'Option 5', id:'option_5'}];
  $scope.newVote = function() {
    console.log($scope.vote)
    $http.post('/new-poll', {
      topic: $scope.vote.topic,
      creator: $scope.vote.creator,
      access_code: $scope.vote.code,
      anonymous: $scope.vote.anonymous,
      option_1: $scope.vote.option_1,
      option_2: $scope.vote.option_2,
      option_3: $scope.vote.option_3,
      option_4: $scope.vote.option_4,
      option_5: $scope.vote.option_5
    }).then(function(result){
      $cookies.put('mod', result.data.poll_id)
      $location.path('/moderator/' + result.data.poll_id);
    })
  }
}])


app.controller('ModeratorController', ['$scope','$interval','$http','$cookies','$routeParams','$location', function($scope, $interval,$http,$cookies, $routeParams, $location){
  $scope.labels = []
  $scope.data = []
  $scope.voteId = $routeParams.id

  function checkForVotes(id){
    $http.get('/poll/' + id + '/results').then(function(result){
      var results = result.data;
      $scope.labels = []
      $scope.data = []
      results.results.forEach(function(result){
        $scope.labels.push(result.vote)
        $scope.data.push(result.count)
      })
      $scope.userVotes = results.publicVotes
      $scope.topic = results.topic
      $scope.creator = results.creator
    })
  }

  if($cookies.get('mod') != $routeParams.id){
    $location.path('/vote/' + $routeParams.id)
  }

  checkForVotes($routeParams.id);

  
  var checker = ''

  $scope.startVote = function(id){
    checker = $interval(function(){
      checkForVotes($routeParams.id)
    }, 1000)
    //to kill once check in DB
    $scope.inProgress = true
  }
  $scope.endVote = function(){
    checkForVotes($routeParams.id)
    $interval.cancel(checker)
    $scope.inProgress = false
  }
}])

app.controller('JoinController', ['$scope', '$location','$http', function($scope, $location, $http) {
  $scope.joinVote = function() {
    $http.get('/poll/' + $scope.id).success(function(err,result){
      if(result.is_active == true){
        console.log("DATA "+ result)
        $location.path('/vote/' + $scope.id)
      }else{
        console.log("DATA "+ result )
        $location.path('/vote/' + $scope.id)
      }
    })
    
  }
}])

app.controller('VoteController', ['$scope','$cookies', '$location', '$routeParams', '$http', function($scope, $cookies, $location, $routeParams, $http) {
  var voteId = $routeParams.id
  if($cookies.get(voteId)){
    $location.path('/vote/' + voteId + '/results')
  }
  $http.get('/poll/' + voteId).then(function(results){
    var options = []
    console.log(results.data)
    for(var i = 1; i < 6; i++){
      var currOpt = 'option_' + i
      if(results.data[currOpt]){
        options.push({choice: results.data[currOpt], id: currOpt})
      }
    }

    $scope.topic = results.data.topic
    $scope.options = options
    $scope.anonymous = results.data.anonymous
    console.log(results.data.anonymous)
  })

  $scope.selectedIndex;

  $scope.optionClicked = function ($index) {
    $scope.selectedIndex = $index;
  };

  $scope.submitVote = function(){
    $cookies.put(voteId, 'voted')
    $scope.choice = '';
    var toSub = 'option_' + ($scope.selectedIndex + 1)
    $scope.options.forEach(function(option) {
      if(option.id == toSub) {
        $scope.choice = option.choice;
      }
    })
    $http.post('/' + voteId + '/vote', {
      poll_id: voteId,
      name: $scope.name,
      vote: $scope.choice
    }).then(function(result){
      $location.path('/vote/' + voteId + '/results')
    })
  }

}])

app.controller('ResultsController', ['$scope', '$http', '$interval','$routeParams', function($scope, $http, $interval, $routeParams) {
  $scope.labels = []
  $scope.data = []
  function checkForVotes(id){
    $http.get('/poll/' + id + '/results').then(function(result){
      var results = result.data;
      $scope.labels = []
      $scope.data = []
      results.results.forEach(function(result){
        $scope.labels.push(result.vote)
        $scope.data.push(result.count)
      })
      console.log(results)
      $scope.userVotes = results.publicVotes
      $scope.topic = results.topic
      $scope.creator = results.creator
    })
  }

  // var checker = $interval(function(){
  //   checkForVotes($routeParams.id)
  // },1000)

  checkForVotes($routeParams.id)

  // if(results.isActive == true){
  //   var getVotes = $interval(function(){
  //     checkForVotes($routeParams.id)
  //   }, 1000)
  // }
  
}])



