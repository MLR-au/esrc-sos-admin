'use strict';

describe('Directive: manageUsers', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<manage-users></manage-users>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the manageUsers directive');
  }));
});
