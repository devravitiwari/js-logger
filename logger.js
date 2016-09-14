(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    factory(root);
  }
}(this, function(global) {

  'use strict';
  
  var logLevel = {
    "debug": "log",
    "info": "info",
    "warning": "warn",
    "error": "error",
    "all": "all",
    "none": "none"
  },
  util;

  if(!global) {
    util = require('util');
    // util.inspect.styles = {
    //   special: 'cyan',
    //   number: 'yellow',
    //   boolean: 'yellow',
    //   undefined: 'grey',
    //   null: 'bold',
    //   string: 'green',
    //   symbol: 'green',
    //   date: 'magenta',
    //   regexp: 'red',
    //   name: 'blue'
    // }
    util.inspect.styles.name = 'blue';
  } 
  
  function Logger(namespace, level) {
    this.namespace = namespace || 'Unknown_Module';
    this.setLogLevel(level);
  }

  Logger.prototype.setLogLevel = setLogLevel; 
  Logger.prototype.log = logMethod('log');
  Logger.prototype.info =  logMethod('info');
  Logger.prototype.warn =  logMethod('warn');
  Logger.prototype.error =  logMethod('error');
  

  function setLogLevel(level) {
    if(!logLevel[level]) {
      var msg = ['Invalid log level `{0}`. Setting to `{1}`. Possible values are - {2}', level, 'debug', Object.keys(logLevel)];
      console.warn.apply(console, getMessageFromTemplateString(msg));
      level = 'debug';  
    }
    this.logLevel = level;
  }

  function logMethod(type) {
    var noop = function() {},
      konsole = (global ? global.console : console) || {},
      logFn = konsole[type] || konsole.log || noop,
      canApply = false;
    
    try {
      canApply = !!logFn.apply;
    } catch(e) {}

    if(canApply) {
      return function() {
        var ns = this.namespace,
          fn = arguments[0], 
          args = [].slice.call(arguments, 1); 
        // this needs to be checked early up
        if(logLevel[this.logLevel] == logLevel.none) {
          return noop;
        } else if(logLevel[this.logLevel] != logLevel.all && logLevel[this.logLevel] != type) {
          return noop;
        }
        
        return logFn.apply(konsole, getLogMessageArgs(ns, fn, getMessageFromTemplateString(args)));
      }      
    }
    return function() {
      logFn(arguments);
    }
  }

  function getLogMessageArgs(ns, fn, messageArgs) {
    var msg = messageArgs.shift(),
      logArgs = [],
      nsColor = 'color:rgb(34,16,116)', 
      fnColor = 'color:rgb(2,131,246)', 
      msgColor = 'color:rgb(50,50,50)';

    if(global) {
      // we are in browser
      logArgs.push('%c' + ns + '.%c' + fn + '%c : '+ msg, nsColor, fnColor, msgColor);
    } else {
      // we are in node environment 
      logArgs.push(ns + '.' + fn + ' : '+ msg);
    }
    
    
    logArgs = logArgs.concat(messageArgs);
    return logArgs;
  }

  function getMessageFromTemplateString(formatArgs) {
    // assuming input is an array with format string and params = ['This is a {0} string', 'format'];
    var args = formatArgs,
      template = args[0],
      argOffset = 1,
      templateString,
      formattedMessage = [];
    
    templateString = template.replace(/\{\d+\}/g, function(match) {
      var index = +match.slice(1, -1) + argOffset,   
        value;
      if(index < args.length) {
        value = args[index];
        if(typeof value === 'object') {          
          if(global) {
            formattedMessage.push(value);
            return '%o';
          } else {
            return util.inspect(value, {colors: true});
          }
        } else if(typeof value === 'function') {
          return value.toString().replace(/ \{[\s\S]*$/, '');
        } else if(typeof value === 'undefined') {
          return 'undefined';
        }
        return value;
      }
      return '';//match;  
    });
    formattedMessage.unshift(templateString);
    return formattedMessage;
  }

  if(global) {
     global.Logger = (global.Logger || Logger);
  }
  return Logger;
}));
