'use strict';

angular.module('adminApp')
  .directive('inviteUser', function () {
    return {
      templateUrl: 'views/invite-user.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
