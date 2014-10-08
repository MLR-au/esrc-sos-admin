'use strict';

angular.module('adminApp')
  .controller('UserCreateCtrl', [ '$scope', '$http', 'AuthService', 'configuration',
        function ($scope, $http, AuthService, configuration) {
      
      // listen for auth service messages
      $scope.ready = false;
      $scope.$on('user-logged-in', function() {
          // check the claims in the token to see if the user is an admin and
          //   set up the permissions accordingly
          $scope.isAdmin = AuthService.claims.admin;
          $scope.ready = true;
      });
      $scope.$on('user-logged-out', function() {
          $scope.isAdmin = false;
          $scope.ready = false;
      });

      // check that the user session is ok
      AuthService.verify();

      var service = configuration[configuration['service']];
      console.log(service);

      // init the userdata object
      $scope.userdata = {};

      $scope.validateEmail = function(email) {
          if (email !== undefined && email !== '') {
              var url = service + '/admin/email/' + email;
              console.log(url);
              $http.get(url).then(function(resp) {
                  $scope.existingUser = resp.data.userdata;
              },
              function(resp) {
              });
          } else {
              $scope.existingUser = undefined;
          }
      }

      $scope.save = function() {
          // ensure all is in order
          $scope.validateEmail($scope.userdata.primaryEmail);
          $scope.validateEmail($scope.userdata.secondaryEmail);

          if (!$scope.existingUser) {
              if ($scope.userdata.username !== undefined && $scope.userdata.primaryEmail !== undefined) {
                  var url = service + '/admin/user/create';
                  $http.post(url, $scope.userdata).then(function(resp) {
                    $scope.userCreated = true;
                  },
                  function(resp) {
                      $scope.failure = true;
                  });
              }
          }
      }

      $scope.reset = function() {
          $scope.existingUser = undefined;
          $scope.userCreated = false;
          $scope.failure = false;
          $scope.userdata = {};
      }
  }]);
