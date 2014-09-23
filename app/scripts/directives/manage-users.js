'use strict';

angular.module('adminApp')
  .directive('manageUsers', function () {
    return {
      templateUrl: 'views/manage-users.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
