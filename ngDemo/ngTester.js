(function(){
  'use strict';
  
  var app = angular.module('app', ['Logger']);

  app.config(['LoggerProvider', function(LogProvider) {

    LogProvider
    .enabled(true) // enabled() = getter - noChaining 
    .configureColors({
      ns: '(218,44,180)' // rgb
    });


  }]);

  app.controller('demo', ['Logger', function(Logger) {
    var model = this, 
      logger = new Logger('demo');
    


    model.title = "Demo Controller";

    model.changeTitle = function(newTitle) {
      logger.log('changeTitle', 'About to change title from "{0}" to "{1}"', model.title, newTitle);
      model.title = newTitle;
    }

  }])


})();