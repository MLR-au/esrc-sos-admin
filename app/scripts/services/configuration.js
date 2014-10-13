'use strict';

angular.module('adminApp')
  .constant('configuration', {
      'development': 'https://essos.esrc.info',
      'testing': '',
      'production': 'https://sos.esrc.unimelb.edu.au',
      'service': 'production'
  });
