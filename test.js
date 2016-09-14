(function(window){
  'use strict';
  if(!window.document) {
    var Logger = require('./logger');
  } else {
    var Logger = window.Logger;
  }

  var obj = {
    name: 'A new obj',
    description: 'A description',
    id: 20
  };

  var logger = new Logger('Rootnamespace', 'all');
  
  function tester() {
    
    var sum = add(2, 4);
    
    logger.log('insideSomeMethod', 'The value of {0} = {1} inside {2}. I want to pass an obj {3} inside log along with array {4}', 'sum', sum, tester, obj, [1,2,3,4]);
    
    logger.info('insideSomeMethod', 'The value of {0} = {1} inside {2}. I want to pass an obj {3} inside log along with {4} array', 'sum', sum, tester, logger, [1,2,3,4]);
    
    logger.warn('insideSomeMethod', 'The value of {0} = {1} inside {2}. I want to pass an obj {3} inside log along with {4} array', 'sum', sum, tester, logger, [1,2,3,4]);
    
    logger.error('insideSomeMethod', 'The value of {0} = {1} inside {2}. I want to pass an obj {3} inside log along with {4} array', 'sum', sum, tester, logger, [1,2,3,4]);
  }

  function add(num1, num2) {
    logger.log('add', 'This is log ({0}, {1})', num1, num2);
    logger.info('add', 'This is info ({0}, {1})', num1, num2);
    logger.warn('add', 'This is warn ({0}, {1})', num1, num2);
    logger.error('add', 'This is error ({0}, {1})', num1, num2);
    return num1 + num2;
  }

  tester();

})(typeof window !== "undefined" ? window : this);