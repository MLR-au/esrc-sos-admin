'use strict';

angular.module('adminApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'MessageCenterModule'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/user/create', {
        templateUrl: 'views/user-create.html',
        controller: 'UserCreateCtrl'
      })
      .when('/logs', {
        templateUrl: 'views/logs.html',
        controller: 'LogsCtrl'
      })
      .when('/user/manage', {
        templateUrl: 'views/user-manage.html',
        controller: 'UserManageCtrl'
      })
      .when('/login/:code', {
        template: '<div></div>',
        controller: 'LoginCtrl'
      })
      .when('/forbidden', {
        templateUrl: 'views/forbidden.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
        }
        return response || $q.when(response);
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
