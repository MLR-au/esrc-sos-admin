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

      $scope.loadUsers = function() {
          var url = service + '/admin/users';
           $http.get(url).then(function(resp) {
               $scope.users = resp.data.users;
           },
           function(resp) {
               if (resp.status === 401) {
                   AuthService.verify();
               }
           });

      }
      $scope.loadUsers();

      var updateUserData = function(userdata) {
          angular.forEach($scope.users, function(v,i) {
              if (v._id === userdata._id) {
                  $scope.users[i] = userdata;
              }
          })
      }

      $scope.access = function(permission, userid, app) {
          if (permission === 'allow') {
              permission = 'allowAccess';
          } else {
              permission = 'denyAccess';
          }
          var url = service + '/admin/user/' + userid;
          var data = {
              'app': app,
              'action': permission
          }
          $http.put(url, data).then(function(resp) {
              updateUserData(resp.data.userdata);
          },
          function(resp) {
               if (resp.status === 401) {
                   AuthService.verify();
               }
          })
      }

      $scope.lockAccount = function(userid) {
          var url = service + '/admin/user/' + userid;
          var data = {
              'action': 'lockAccount'
          }
          $http.put(url, data).then(function(resp) {
              updateUserData(resp.data.userdata);
          },
          function(resp) {
               if (resp.status === 401) {
                   AuthService.verify();
               }
          })
      }

      $scope.deleteAccount = function(userid) {
          var url = service + '/admin/user/' + userid;
          $http.delete(url).then(function(resp) {
              angular.forEach($scope.users, function(v, k) {
                  if (v._id === userid) {
                      $scope.users.splice(k, 1);
                  }
              })
          },
          function(resp) {
               if (resp.status === 401) {
                   AuthService.verify();
               }
          })
      }

      $scope.appPermission = function(permission) {
          if (permission === 'allow') { 
              return true;
          } else {
              return false;
          }
      }
  }]);
