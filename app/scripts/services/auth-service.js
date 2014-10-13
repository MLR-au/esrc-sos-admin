'use strict';

angular.module('adminApp')
  .service('AuthService', [ '$location', '$routeParams', '$http', '$rootScope', '$timeout', 'messageCenterService',
        function AuthService($location, $routeParams, $http, $rootScope, $timeout, MCS) {

      /* Messages:
       * When the user logs in to the app successfully the service will broadcast via
       *  the rootScope the message: 'user-logged-in'
       */

      var debug = true;
      var log = function(msg) {
          if (debug) {
              console.log(msg);
          }
      };
      
      /* 
       * @function: init
       */
      function init() {
          // is there a token stored in localStorage?
          log('AuthService.init()');
          if (localStorage.getItem('token') === null) {
              // no - redirect to login service
              AuthService.login();
          
          // yes - verify it against the login service
          } else {
              log('Found local token. Verifying');
              AuthService.verify();
          }
      }

      /*
       * @function: login
       */
      function login() {
          log('AuthService.login(). Redirecting to login service.');
          var redirectTo = AuthService.service + '/?r=' + encodeURIComponent($location.absUrl());
          window.location = redirectTo;
      }

      /*
       * @function: logout
       */
      function logout() {
          log('AuthService.logout(). Removing local token.');
          localStorage.removeItem('token');
          $rootScope.$broadcast('user-logged-out');
      }

      /*
       * @function: getToken
       */
      function getToken() {
          log('AuthService.getToken()');
          if ($routeParams.code === undefined) {
              AuthService.login();
          } else {
              log('Found code. Retrieving token.');
              var url = AuthService.service + '/token/' + $routeParams.code + '?r=' + encodeURIComponent($location.absUrl());
              console.log(url);
              $http.get(url).then(function(resp) {
                  log('Saving token. Redirecting to home page.');
                  localStorage.setItem('token', resp.data);
                  $location.url('/');
              },
              function(resp) {
                  // if we get a 401 unauthorized - try the login again
                  if (resp.status === 401) {
                      AuthService.login();
                  }
              });
          }
      }

      /*
       * @function: verify
       */
      function verify(redirectToLogin) {
          log('AuthService.verify()');
          var url = AuthService.service + '/token';
          $http.get(url).then(function(resp) {
              AuthService.claims = resp.data.claims;
              $rootScope.$broadcast('user-logged-in');
          },
          function(resp) {
              // if we get a 401 Unauthorized - try the login again
              if (resp.status === 401) {
                  $rootScope.$broadcast('user-logged-out');
                  if (redirectToLogin !== false) {
                      MCS.removeShown();
                      MCS.add('danger', 'You are not authorized to use this application. Redirecting you to the login service in 3s.',
                          { status: MCS.status.shown}, { timeout: 3000 });

                      $timeout(function(){ 
                          MCS.removeShown(); 
                          AuthService.login() 
                      }, 3000);
                  }
              }
          });
      }

      var AuthService = {
          service: 'https://sos.esrc.unimelb.edu.au',
          token: undefined,
          verified: false,
          init: init,
          login: login,
          logout: logout,
          getToken: getToken,
          verify: verify
      };
      return AuthService;

  }]);
