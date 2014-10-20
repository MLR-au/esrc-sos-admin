'use strict';

angular.module('adminApp')
  .controller('UserCreateCtrl', [ '$scope', '$http', 'AuthService', 'configuration', 'messageCenterService',
        function ($scope, $http, AuthService, configuration, MCS) {
      
      // listen for auth service messages
      $scope.ready = false;
      $scope.$on('user-logged-in', function() {
          // check the claims in the token to see if the user is an admin and
          //   set up the permissions accordingly
          var userData = AuthService.getUserData();
          $scope.admin = userData.admin;
          $scope.name = userData.name;
          $scope.ready = true;
      });
      $scope.$on('user-logged-out', function() {
          $scope.admin = false;
          $scope.name = undefined;
          $scope.ready = false;
      });

      // check that the user session is ok
      AuthService.verify();

      var service = configuration[configuration['service']];

      // init the userdata object
      $scope.userdata = {};

      $scope.validateEmail = function(email) {
          if (email !== undefined && email !== '') {
              var url = service + '/admin/email/' + email;
              console.log(url);
              $http.get(url).then(function(resp) {
                  if (resp.data.userdata !== '') {
                      MCS.add('danger', "There's already a user with that email address.", { status: MCS.status.shown});
                      $scope.existingUser = resp.data.userdata;
                  }
              },
              function(resp) {
                  MCS.add('danger', "Error trying to check the email address.", { status: MCS.status.shown});
              });
          } else {
              MCS.removeShown();
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
                    MCS.add('success', "User account created.", { status: MCS.status.shown});
                    $scope.userCreated = true;
                  },
                  function(resp) {
                      MCS.add('danger', "Error trying to create the user account.", { status: MCS.status.shown});
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
          MCS.removeShown();
      }
  }]);
