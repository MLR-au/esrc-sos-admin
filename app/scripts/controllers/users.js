'use strict';

angular.module('adminApp')
  .controller('UsersCtrl', [ '$scope', '$http', 'AuthService', function ($scope, $http, AuthService) {

      // check that the user session is still ok
      AuthService.verify();

      // get the list of users from the sign on service
      var url = AuthService.service + '/users';
      var config = {
          'url': url,
          'method': 'POST',
          'data': {
              'token': AuthService.token
          }

      };
      console.log(config);
      $http.post(url, config).then(function(resp) {
          console.log(resp);
      },
      function(resp) {
          console.log(resp);
      });


  }]);
