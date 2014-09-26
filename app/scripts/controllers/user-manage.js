'use strict';

angular.module('adminApp')
  .controller('UserManageCtrl', [ '$scope', 'AuthService', function ($scope, AuthService) {
      // listen for the logged in message from the auth service
      $scope.ready = false;
      $scope.$on('user-logged-in', function() {
          // check the claims in the token to see if the user is an admin and
          //   set up the permissions accordingly
          $scope.isAdmin = AuthService.claims.isAdmin;
          $scope.ready = true;
      });
      $scope.$on('user-logged-out', function() {
          $scope.isAdmin = false;
          $scope.ready = false;
      });

      // check that the user session is ok
      AuthService.verify();
  }]);
