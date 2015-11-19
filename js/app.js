var app = angular.module('allInFavor', ['ngRoute', 'ngCookies', 'chart.js'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html'
      })
      .when('/create', {
        templateUrl: '/partials/create.html',
        controller: 'CreateController'
      })
      .when('/join', {
        templateUrl: '/partials/join.html',
        controller: 'JoinController'
      })
      .when('/moderator/:id', {
        templateUrl: '/partials/moderator.html',
        controller: 'ModeratorController'
      })
      .when('/vote/:id/results', {
        templateUrl: '/partials/results.html',
        controller: 'ResultsController'
      })
      .when('/vote/:id', {
        templateUrl: '/partials/vote.html',
        controller: 'VoteController'
      })
      
    $locationProvider.html5Mode(true);
  })