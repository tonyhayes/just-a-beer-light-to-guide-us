/* */ 
(function(process) {
  angular.module('ngTasty.service.bindTo', []).factory('bindTo', function($parse) {
    return function(scopeName, scope, attrs, newScopeName) {
      var lastValue,
          parentGet,
          compare,
          parentSet,
          parentValueWatch,
          isolateScopeName;
      if (!attrs[scopeName]) {
        return ;
      }
      parentGet = $parse(attrs[scopeName]);
      if (parentGet.literal) {
        compare = angular.equals;
      } else {
        compare = function(a, b) {
          return a === b || (a !== a && b !== b);
        };
      }
      if (newScopeName) {
        isolateScopeName = newScopeName;
      } else {
        isolateScopeName = scopeName;
      }
      parentSet = parentGet.assign || function() {
        lastValue = scope[scopeName] = parentGet(scopeName);
        throw 'Expression ' + attrs[attrName] + ' is non-assignable!';
      };
      lastValue = scope[isolateScopeName] = parentGet(scope.$parent);
      parentValueWatch = function parentValueWatch(parentValue) {
        if (!compare(parentValue, scope[isolateScopeName])) {
          if (!compare(parentValue, lastValue)) {
            scope[isolateScopeName] = parentValue;
          } else {
            parentSet(scope.$parent, parentValue = scope[isolateScopeName]);
          }
        }
        return lastValue = parentValue;
      };
      parentValueWatch.$stateful = true;
      scope.$parent.$watch($parse(attrs[scopeName], parentValueWatch), null, parentGet.literal);
    };
  });
})(require("process"));
