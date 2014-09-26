'use strict';

angular.module('adminApp')
  .controller('UserCreateCtrl', [ '$scope', '$http', 'AuthService', 'configuration',
        function ($scope, $http, AuthService, configuration) {
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

          var service = configuration[configuration['service']];
          console.log(service);

          // init the userdata object
          $scope.userdata = {};

          var validateEmail = function(email) {
              if (email !== undefined) {
                  var url = service + '/admin/email/' + email;
                  console.log(url);
                  $http.get(url).then(function(resp) {
                      console.log(resp);
                      $scope.existingUser = resp.data.userdata;
                  },
                  function(resp) {
                  });
              }
          }

          $scope.validatePrimaryEmail = function() {
              var result = validateEmail($scope.userdata.primaryEmail);
          }

          $scope.validateSecondaryEmail = function() {
              var result = validateEmail($scope.userdata.secondaryEmail);
          }
          $scope.save = function() {
              // ensure all is in order
              $scope.validatePrimaryEmail();
              $scope.validateSecondaryEmail();

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
