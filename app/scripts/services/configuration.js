'use strict';

angular.module('adminApp')
  .constant('configuration', {
      'development': 'https://service.esrc.info',
      'testing': '',
      'production': 'https://sos.esrc.unimelb.edu.au',
      'service': 'development'
  });
