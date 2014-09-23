'use strict';

angular.module('adminApp')
  .controller('LoginCtrl', [ '$scope', 'AuthService', function ($scope, AuthService) {
      AuthService.getToken();
  }]);
