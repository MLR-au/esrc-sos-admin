'use strict';

angular.module('adminApp')
  .controller('MainCtrl', [ '$scope', 'AuthService', function ($scope, AuthService) {

    // listen for the logged in message from the auth service
    $scope.ready = false;
    $scope.$on('user-logged-in', function() {
        // check the claims in the token to see if the user is an admin and 
        //   set up the permissions accordingly
        $scope.isAdmin = AuthService.claims.admin;
        $scope.fullname = AuthService.claims.fullname;
        console.log(AuthService.claims);
        $scope.ready = true;
    });
    $scope.$on('user-logged-out', function() {
        $scope.isAdmin = false;
        $scope.ready = false;
    });


    // Valid token?
    AuthService.verify(false);

    $scope.login =  function() {
        // Log the user in - or otherwise
        AuthService.login();
    };

    $scope.logout = function() {
        // initialise the authentication service
        AuthService.logout();
    };

  }]);
