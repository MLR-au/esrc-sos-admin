'use strict';

angular.module('adminApp')
  .controller('UserManageCtrl', [ '$scope', '$http', 'AuthService', 'configuration', 
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

          $scope.loadUsers = function() {
              var url = service + '/admin/users';
               $http.get(url).then(function(resp) {
                   $scope.users = resp.data.users;
                   console.log($scope.users);
               },
               function(resp) {
               });

          }
          $scope.loadUsers();

          $scope.allowAccess = function(userid, app) {
              console.log('allow', userid, app);
              var url = service + '/admin/user/' + userid;
              var data = {
                  'app': app,
                  'action': 'allowAccess'
              }
              $http.put(url, data).then(function(resp) {
              },
              function(resp) {
              })
          }

          $scope.removeAccess = function(userid, app) {
              console.log('remove', userid, app);
              var url = service + '/admin/user/' + userid;
              var data = {
                  'app': app,
                  'action': 'denyAccess'
              }
              $http.put(url, data).then(function(resp) {
              },
              function(resp) {
              })
          }

          $scope.lockAccount = function(userid) {
              console.log('lock', userid);
              var url = service + '/admin/user/' + userid;
              var data = {
                  'action': 'lockAccount'
              }
              $http.put(url, data).then(function(resp) {
                  console.log(resp);
              },
              function(resp) {
              })
          }

          $scope.deleteAccount = function(userid) {
              console.log('delete', userid);
              var url = service + '/admin/user/' + userid;
              $http.delete(url).then(function(resp) {
                  $scope.loadUsers();
              },
              function(resp) {
              })
          }
  }]);
