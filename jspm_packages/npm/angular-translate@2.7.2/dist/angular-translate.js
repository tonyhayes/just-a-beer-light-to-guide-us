/* */ 
"format cjs";
(function(process) {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return (factory());
      });
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      factory();
    }
  }(this, function() {
    angular.module('pascalprecht.translate', ['ng']).run(runTranslate);
    function runTranslate($translate) {
      'use strict';
      var key = $translate.storageKey(),
          storage = $translate.storage();
      var fallbackFromIncorrectStorageValue = function() {
        var preferred = $translate.preferredLanguage();
        if (angular.isString(preferred)) {
          $translate.use(preferred);
        } else {
          storage.put(key, $translate.use());
        }
      };
      fallbackFromIncorrectStorageValue.displayName = 'fallbackFromIncorrectStorageValue';
      if (storage) {
        if (!storage.get(key)) {
          fallbackFromIncorrectStorageValue();
        } else {
          $translate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
        }
      } else if (angular.isString($translate.preferredLanguage())) {
        $translate.use($translate.preferredLanguage());
      }
    }
    runTranslate.$inject = ['$translate'];
    runTranslate.displayName = 'runTranslate';
    angular.module('pascalprecht.translate').provider('$translateSanitization', $translateSanitizationProvider);
    function $translateSanitizationProvider() {
      'use strict';
      var $sanitize,
          currentStrategy = null,
          hasConfiguredStrategy = false,
          hasShownNoStrategyConfiguredWarning = false,
          strategies;
      strategies = {
        sanitize: function(value, mode) {
          if (mode === 'text') {
            value = htmlSanitizeValue(value);
          }
          return value;
        },
        escape: function(value, mode) {
          if (mode === 'text') {
            value = htmlEscapeValue(value);
          }
          return value;
        },
        sanitizeParameters: function(value, mode) {
          if (mode === 'params') {
            value = mapInterpolationParameters(value, htmlSanitizeValue);
          }
          return value;
        },
        escapeParameters: function(value, mode) {
          if (mode === 'params') {
            value = mapInterpolationParameters(value, htmlEscapeValue);
          }
          return value;
        }
      };
      strategies.escaped = strategies.escapeParameters;
      this.addStrategy = function(strategyName, strategyFunction) {
        strategies[strategyName] = strategyFunction;
        return this;
      };
      this.removeStrategy = function(strategyName) {
        delete strategies[strategyName];
        return this;
      };
      this.useStrategy = function(strategy) {
        hasConfiguredStrategy = true;
        currentStrategy = strategy;
        return this;
      };
      this.$get = ['$injector', '$log', function($injector, $log) {
        var applyStrategies = function(value, mode, selectedStrategies) {
          angular.forEach(selectedStrategies, function(selectedStrategy) {
            if (angular.isFunction(selectedStrategy)) {
              value = selectedStrategy(value, mode);
            } else if (angular.isFunction(strategies[selectedStrategy])) {
              value = strategies[selectedStrategy](value, mode);
            } else {
              throw new Error('pascalprecht.translate.$translateSanitization: Unknown sanitization strategy: \'' + selectedStrategy + '\'');
            }
          });
          return value;
        };
        var showNoStrategyConfiguredWarning = function() {
          if (!hasConfiguredStrategy && !hasShownNoStrategyConfiguredWarning) {
            $log.warn('pascalprecht.translate.$translateSanitization: No sanitization strategy has been configured. This can have serious security implications. See http://angular-translate.github.io/docs/#/guide/19_security for details.');
            hasShownNoStrategyConfiguredWarning = true;
          }
        };
        if ($injector.has('$sanitize')) {
          $sanitize = $injector.get('$sanitize');
        }
        return {
          useStrategy: (function(self) {
            return function(strategy) {
              self.useStrategy(strategy);
            };
          })(this),
          sanitize: function(value, mode, strategy) {
            if (!currentStrategy) {
              showNoStrategyConfiguredWarning();
            }
            if (arguments.length < 3) {
              strategy = currentStrategy;
            }
            if (!strategy) {
              return value;
            }
            var selectedStrategies = angular.isArray(strategy) ? strategy : [strategy];
            return applyStrategies(value, mode, selectedStrategies);
          }
        };
      }];
      var htmlEscapeValue = function(value) {
        var element = angular.element('<div></div>');
        element.text(value);
        return element.html();
      };
      var htmlSanitizeValue = function(value) {
        if (!$sanitize) {
          throw new Error('pascalprecht.translate.$translateSanitization: Error cannot find $sanitize service. Either include the ngSanitize module (https://docs.angularjs.org/api/ngSanitize) or use a sanitization strategy which does not depend on $sanitize, such as \'escape\'.');
        }
        return $sanitize(value);
      };
      var mapInterpolationParameters = function(value, iteratee) {
        if (angular.isObject(value)) {
          var result = angular.isArray(value) ? [] : {};
          angular.forEach(value, function(propertyValue, propertyKey) {
            result[propertyKey] = mapInterpolationParameters(propertyValue, iteratee);
          });
          return result;
        } else if (angular.isNumber(value)) {
          return value;
        } else {
          return iteratee(value);
        }
      };
    }
    angular.module('pascalprecht.translate').constant('pascalprechtTranslateOverrider', {}).provider('$translate', $translate);
    function $translate($STORAGE_KEY, $windowProvider, $translateSanitizationProvider, pascalprechtTranslateOverrider) {
      'use strict';
      var $translationTable = {},
          $preferredLanguage,
          $availableLanguageKeys = [],
          $languageKeyAliases,
          $fallbackLanguage,
          $fallbackWasString,
          $uses,
          $nextLang,
          $storageFactory,
          $storageKey = $STORAGE_KEY,
          $storagePrefix,
          $missingTranslationHandlerFactory,
          $interpolationFactory,
          $interpolatorFactories = [],
          $loaderFactory,
          $cloakClassName = 'translate-cloak',
          $loaderOptions,
          $notFoundIndicatorLeft,
          $notFoundIndicatorRight,
          $postCompilingEnabled = false,
          $forceAsyncReloadEnabled = false,
          NESTED_OBJECT_DELIMITER = '.',
          loaderCache,
          directivePriority = 0,
          statefulFilter = true,
          uniformLanguageTagResolver = 'default',
          languageTagResolver = {
            'default': function(tag) {
              return (tag || '').split('-').join('_');
            },
            java: function(tag) {
              var temp = (tag || '').split('-').join('_');
              var parts = temp.split('_');
              return parts.length > 1 ? (parts[0].toLowerCase() + '_' + parts[1].toUpperCase()) : temp;
            },
            bcp47: function(tag) {
              var temp = (tag || '').split('_').join('-');
              var parts = temp.split('-');
              return parts.length > 1 ? (parts[0].toLowerCase() + '-' + parts[1].toUpperCase()) : temp;
            }
          };
      var version = '2.7.2';
      var getFirstBrowserLanguage = function() {
        if (angular.isFunction(pascalprechtTranslateOverrider.getLocale)) {
          return pascalprechtTranslateOverrider.getLocale();
        }
        var nav = $windowProvider.$get().navigator,
            browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
            i,
            language;
        if (angular.isArray(nav.languages)) {
          for (i = 0; i < nav.languages.length; i++) {
            language = nav.languages[i];
            if (language && language.length) {
              return language;
            }
          }
        }
        for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
          language = nav[browserLanguagePropertyKeys[i]];
          if (language && language.length) {
            return language;
          }
        }
        return null;
      };
      getFirstBrowserLanguage.displayName = 'angular-translate/service: getFirstBrowserLanguage';
      var getLocale = function() {
        var locale = getFirstBrowserLanguage() || '';
        if (languageTagResolver[uniformLanguageTagResolver]) {
          locale = languageTagResolver[uniformLanguageTagResolver](locale);
        }
        return locale;
      };
      getLocale.displayName = 'angular-translate/service: getLocale';
      var indexOf = function(array, searchElement) {
        for (var i = 0,
            len = array.length; i < len; i++) {
          if (array[i] === searchElement) {
            return i;
          }
        }
        return -1;
      };
      var trim = function() {
        return this.toString().replace(/^\s+|\s+$/g, '');
      };
      var negotiateLocale = function(preferred) {
        var avail = [],
            locale = angular.lowercase(preferred),
            i = 0,
            n = $availableLanguageKeys.length;
        for (; i < n; i++) {
          avail.push(angular.lowercase($availableLanguageKeys[i]));
        }
        if (indexOf(avail, locale) > -1) {
          return preferred;
        }
        if ($languageKeyAliases) {
          var alias;
          for (var langKeyAlias in $languageKeyAliases) {
            var hasWildcardKey = false;
            var hasExactKey = Object.prototype.hasOwnProperty.call($languageKeyAliases, langKeyAlias) && angular.lowercase(langKeyAlias) === angular.lowercase(preferred);
            if (langKeyAlias.slice(-1) === '*') {
              hasWildcardKey = langKeyAlias.slice(0, -1) === preferred.slice(0, langKeyAlias.length - 1);
            }
            if (hasExactKey || hasWildcardKey) {
              alias = $languageKeyAliases[langKeyAlias];
              if (indexOf(avail, angular.lowercase(alias)) > -1) {
                return alias;
              }
            }
          }
        }
        if (preferred) {
          var parts = preferred.split('_');
          if (parts.length > 1 && indexOf(avail, angular.lowercase(parts[0])) > -1) {
            return parts[0];
          }
        }
        return preferred;
      };
      var translations = function(langKey, translationTable) {
        if (!langKey && !translationTable) {
          return $translationTable;
        }
        if (langKey && !translationTable) {
          if (angular.isString(langKey)) {
            return $translationTable[langKey];
          }
        } else {
          if (!angular.isObject($translationTable[langKey])) {
            $translationTable[langKey] = {};
          }
          angular.extend($translationTable[langKey], flatObject(translationTable));
        }
        return this;
      };
      this.translations = translations;
      this.cloakClassName = function(name) {
        if (!name) {
          return $cloakClassName;
        }
        $cloakClassName = name;
        return this;
      };
      var flatObject = function(data, path, result, prevKey) {
        var key,
            keyWithPath,
            keyWithShortPath,
            val;
        if (!path) {
          path = [];
        }
        if (!result) {
          result = {};
        }
        for (key in data) {
          if (!Object.prototype.hasOwnProperty.call(data, key)) {
            continue;
          }
          val = data[key];
          if (angular.isObject(val)) {
            flatObject(val, path.concat(key), result, key);
          } else {
            keyWithPath = path.length ? ('' + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key) : key;
            if (path.length && key === prevKey) {
              keyWithShortPath = '' + path.join(NESTED_OBJECT_DELIMITER);
              result[keyWithShortPath] = '@:' + keyWithPath;
            }
            result[keyWithPath] = val;
          }
        }
        return result;
      };
      flatObject.displayName = 'flatObject';
      this.addInterpolation = function(factory) {
        $interpolatorFactories.push(factory);
        return this;
      };
      this.useMessageFormatInterpolation = function() {
        return this.useInterpolation('$translateMessageFormatInterpolation');
      };
      this.useInterpolation = function(factory) {
        $interpolationFactory = factory;
        return this;
      };
      this.useSanitizeValueStrategy = function(value) {
        $translateSanitizationProvider.useStrategy(value);
        return this;
      };
      this.preferredLanguage = function(langKey) {
        setupPreferredLanguage(langKey);
        return this;
      };
      var setupPreferredLanguage = function(langKey) {
        if (langKey) {
          $preferredLanguage = langKey;
        }
        return $preferredLanguage;
      };
      this.translationNotFoundIndicator = function(indicator) {
        this.translationNotFoundIndicatorLeft(indicator);
        this.translationNotFoundIndicatorRight(indicator);
        return this;
      };
      this.translationNotFoundIndicatorLeft = function(indicator) {
        if (!indicator) {
          return $notFoundIndicatorLeft;
        }
        $notFoundIndicatorLeft = indicator;
        return this;
      };
      this.translationNotFoundIndicatorRight = function(indicator) {
        if (!indicator) {
          return $notFoundIndicatorRight;
        }
        $notFoundIndicatorRight = indicator;
        return this;
      };
      this.fallbackLanguage = function(langKey) {
        fallbackStack(langKey);
        return this;
      };
      var fallbackStack = function(langKey) {
        if (langKey) {
          if (angular.isString(langKey)) {
            $fallbackWasString = true;
            $fallbackLanguage = [langKey];
          } else if (angular.isArray(langKey)) {
            $fallbackWasString = false;
            $fallbackLanguage = langKey;
          }
          if (angular.isString($preferredLanguage) && indexOf($fallbackLanguage, $preferredLanguage) < 0) {
            $fallbackLanguage.push($preferredLanguage);
          }
          return this;
        } else {
          if ($fallbackWasString) {
            return $fallbackLanguage[0];
          } else {
            return $fallbackLanguage;
          }
        }
      };
      this.use = function(langKey) {
        if (langKey) {
          if (!$translationTable[langKey] && (!$loaderFactory)) {
            throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
          }
          $uses = langKey;
          return this;
        }
        return $uses;
      };
      var storageKey = function(key) {
        if (!key) {
          if ($storagePrefix) {
            return $storagePrefix + $storageKey;
          }
          return $storageKey;
        }
        $storageKey = key;
        return this;
      };
      this.storageKey = storageKey;
      this.useUrlLoader = function(url, options) {
        return this.useLoader('$translateUrlLoader', angular.extend({url: url}, options));
      };
      this.useStaticFilesLoader = function(options) {
        return this.useLoader('$translateStaticFilesLoader', options);
      };
      this.useLoader = function(loaderFactory, options) {
        $loaderFactory = loaderFactory;
        $loaderOptions = options || {};
        return this;
      };
      this.useLocalStorage = function() {
        return this.useStorage('$translateLocalStorage');
      };
      this.useCookieStorage = function() {
        return this.useStorage('$translateCookieStorage');
      };
      this.useStorage = function(storageFactory) {
        $storageFactory = storageFactory;
        return this;
      };
      this.storagePrefix = function(prefix) {
        if (!prefix) {
          return prefix;
        }
        $storagePrefix = prefix;
        return this;
      };
      this.useMissingTranslationHandlerLog = function() {
        return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
      };
      this.useMissingTranslationHandler = function(factory) {
        $missingTranslationHandlerFactory = factory;
        return this;
      };
      this.usePostCompiling = function(value) {
        $postCompilingEnabled = !(!value);
        return this;
      };
      this.forceAsyncReload = function(value) {
        $forceAsyncReloadEnabled = !(!value);
        return this;
      };
      this.uniformLanguageTag = function(options) {
        if (!options) {
          options = {};
        } else if (angular.isString(options)) {
          options = {standard: options};
        }
        uniformLanguageTagResolver = options.standard;
        return this;
      };
      this.determinePreferredLanguage = function(fn) {
        var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();
        if (!$availableLanguageKeys.length) {
          $preferredLanguage = locale;
        } else {
          $preferredLanguage = negotiateLocale(locale);
        }
        return this;
      };
      this.registerAvailableLanguageKeys = function(languageKeys, aliases) {
        if (languageKeys) {
          $availableLanguageKeys = languageKeys;
          if (aliases) {
            $languageKeyAliases = aliases;
          }
          return this;
        }
        return $availableLanguageKeys;
      };
      this.useLoaderCache = function(cache) {
        if (cache === false) {
          loaderCache = undefined;
        } else if (cache === true) {
          loaderCache = true;
        } else if (typeof(cache) === 'undefined') {
          loaderCache = '$translationCache';
        } else if (cache) {
          loaderCache = cache;
        }
        return this;
      };
      this.directivePriority = function(priority) {
        if (priority === undefined) {
          return directivePriority;
        } else {
          directivePriority = priority;
          return this;
        }
      };
      this.statefulFilter = function(state) {
        if (state === undefined) {
          return statefulFilter;
        } else {
          statefulFilter = state;
          return this;
        }
      };
      this.$get = ['$log', '$injector', '$rootScope', '$q', function($log, $injector, $rootScope, $q) {
        var Storage,
            defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
            pendingLoader = false,
            interpolatorHashMap = {},
            langPromises = {},
            fallbackIndex,
            startFallbackIteration;
        var $translate = function(translationId, interpolateParams, interpolationId, defaultTranslationText) {
          if (angular.isArray(translationId)) {
            var translateAll = function(translationIds) {
              var results = {};
              var promises = [];
              var translate = function(translationId) {
                var deferred = $q.defer();
                var regardless = function(value) {
                  results[translationId] = value;
                  deferred.resolve([translationId, value]);
                };
                $translate(translationId, interpolateParams, interpolationId, defaultTranslationText).then(regardless, regardless);
                return deferred.promise;
              };
              for (var i = 0,
                  c = translationIds.length; i < c; i++) {
                promises.push(translate(translationIds[i]));
              }
              return $q.all(promises).then(function() {
                return results;
              });
            };
            return translateAll(translationId);
          }
          var deferred = $q.defer();
          if (translationId) {
            translationId = trim.apply(translationId);
          }
          var promiseToWaitFor = (function() {
            var promise = $preferredLanguage ? langPromises[$preferredLanguage] : langPromises[$uses];
            fallbackIndex = 0;
            if ($storageFactory && !promise) {
              var langKey = Storage.get($storageKey);
              promise = langPromises[langKey];
              if ($fallbackLanguage && $fallbackLanguage.length) {
                var index = indexOf($fallbackLanguage, langKey);
                fallbackIndex = (index === 0) ? 1 : 0;
                if (indexOf($fallbackLanguage, $preferredLanguage) < 0) {
                  $fallbackLanguage.push($preferredLanguage);
                }
              }
            }
            return promise;
          }());
          if (!promiseToWaitFor) {
            determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText).then(deferred.resolve, deferred.reject);
          } else {
            var promiseResolved = function() {
              determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText).then(deferred.resolve, deferred.reject);
            };
            promiseResolved.displayName = 'promiseResolved';
            promiseToWaitFor['finally'](promiseResolved, deferred.reject);
          }
          return deferred.promise;
        };
        var applyNotFoundIndicators = function(translationId) {
          if ($notFoundIndicatorLeft) {
            translationId = [$notFoundIndicatorLeft, translationId].join(' ');
          }
          if ($notFoundIndicatorRight) {
            translationId = [translationId, $notFoundIndicatorRight].join(' ');
          }
          return translationId;
        };
        var useLanguage = function(key) {
          $uses = key;
          $rootScope.$emit('$translateChangeSuccess', {language: key});
          if ($storageFactory) {
            Storage.put($translate.storageKey(), $uses);
          }
          defaultInterpolator.setLocale($uses);
          var eachInterpolator = function(interpolator, id) {
            interpolatorHashMap[id].setLocale($uses);
          };
          eachInterpolator.displayName = 'eachInterpolatorLocaleSetter';
          angular.forEach(interpolatorHashMap, eachInterpolator);
          $rootScope.$emit('$translateChangeEnd', {language: key});
        };
        var loadAsync = function(key) {
          if (!key) {
            throw 'No language key specified for loading.';
          }
          var deferred = $q.defer();
          $rootScope.$emit('$translateLoadingStart', {language: key});
          pendingLoader = true;
          var cache = loaderCache;
          if (typeof(cache) === 'string') {
            cache = $injector.get(cache);
          }
          var loaderOptions = angular.extend({}, $loaderOptions, {
            key: key,
            $http: angular.extend({}, {cache: cache}, $loaderOptions.$http)
          });
          var onLoaderSuccess = function(data) {
            var translationTable = {};
            $rootScope.$emit('$translateLoadingSuccess', {language: key});
            if (angular.isArray(data)) {
              angular.forEach(data, function(table) {
                angular.extend(translationTable, flatObject(table));
              });
            } else {
              angular.extend(translationTable, flatObject(data));
            }
            pendingLoader = false;
            deferred.resolve({
              key: key,
              table: translationTable
            });
            $rootScope.$emit('$translateLoadingEnd', {language: key});
          };
          onLoaderSuccess.displayName = 'onLoaderSuccess';
          var onLoaderError = function(key) {
            $rootScope.$emit('$translateLoadingError', {language: key});
            deferred.reject(key);
            $rootScope.$emit('$translateLoadingEnd', {language: key});
          };
          onLoaderError.displayName = 'onLoaderError';
          $injector.get($loaderFactory)(loaderOptions).then(onLoaderSuccess, onLoaderError);
          return deferred.promise;
        };
        if ($storageFactory) {
          Storage = $injector.get($storageFactory);
          if (!Storage.get || !Storage.put) {
            throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
          }
        }
        if ($interpolatorFactories.length) {
          var eachInterpolationFactory = function(interpolatorFactory) {
            var interpolator = $injector.get(interpolatorFactory);
            interpolator.setLocale($preferredLanguage || $uses);
            interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
          };
          eachInterpolationFactory.displayName = 'interpolationFactoryAdder';
          angular.forEach($interpolatorFactories, eachInterpolationFactory);
        }
        var getTranslationTable = function(langKey) {
          var deferred = $q.defer();
          if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
            deferred.resolve($translationTable[langKey]);
          } else if (langPromises[langKey]) {
            var onResolve = function(data) {
              translations(data.key, data.table);
              deferred.resolve(data.table);
            };
            onResolve.displayName = 'translationTableResolver';
            langPromises[langKey].then(onResolve, deferred.reject);
          } else {
            deferred.reject();
          }
          return deferred.promise;
        };
        var getFallbackTranslation = function(langKey, translationId, interpolateParams, Interpolator) {
          var deferred = $q.defer();
          var onResolve = function(translationTable) {
            if (Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
              Interpolator.setLocale(langKey);
              var translation = translationTable[translationId];
              if (translation.substr(0, 2) === '@:') {
                getFallbackTranslation(langKey, translation.substr(2), interpolateParams, Interpolator).then(deferred.resolve, deferred.reject);
              } else {
                deferred.resolve(Interpolator.interpolate(translationTable[translationId], interpolateParams));
              }
              Interpolator.setLocale($uses);
            } else {
              deferred.reject();
            }
          };
          onResolve.displayName = 'fallbackTranslationResolver';
          getTranslationTable(langKey).then(onResolve, deferred.reject);
          return deferred.promise;
        };
        var getFallbackTranslationInstant = function(langKey, translationId, interpolateParams, Interpolator) {
          var result,
              translationTable = $translationTable[langKey];
          if (translationTable && Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
            Interpolator.setLocale(langKey);
            result = Interpolator.interpolate(translationTable[translationId], interpolateParams);
            if (result.substr(0, 2) === '@:') {
              return getFallbackTranslationInstant(langKey, result.substr(2), interpolateParams, Interpolator);
            }
            Interpolator.setLocale($uses);
          }
          return result;
        };
        var translateByHandler = function(translationId, interpolateParams) {
          if ($missingTranslationHandlerFactory) {
            var resultString = $injector.get($missingTranslationHandlerFactory)(translationId, $uses, interpolateParams);
            if (resultString !== undefined) {
              return resultString;
            } else {
              return translationId;
            }
          } else {
            return translationId;
          }
        };
        var resolveForFallbackLanguage = function(fallbackLanguageIndex, translationId, interpolateParams, Interpolator, defaultTranslationText) {
          var deferred = $q.defer();
          if (fallbackLanguageIndex < $fallbackLanguage.length) {
            var langKey = $fallbackLanguage[fallbackLanguageIndex];
            getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator).then(deferred.resolve, function() {
              resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator, defaultTranslationText).then(deferred.resolve);
            });
          } else {
            if (defaultTranslationText) {
              deferred.resolve(defaultTranslationText);
            } else {
              deferred.resolve(translateByHandler(translationId, interpolateParams));
            }
          }
          return deferred.promise;
        };
        var resolveForFallbackLanguageInstant = function(fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
          var result;
          if (fallbackLanguageIndex < $fallbackLanguage.length) {
            var langKey = $fallbackLanguage[fallbackLanguageIndex];
            result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator);
            if (!result) {
              result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
            }
          }
          return result;
        };
        var fallbackTranslation = function(translationId, interpolateParams, Interpolator, defaultTranslationText) {
          return resolveForFallbackLanguage((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, defaultTranslationText);
        };
        var fallbackTranslationInstant = function(translationId, interpolateParams, Interpolator) {
          return resolveForFallbackLanguageInstant((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator);
        };
        var determineTranslation = function(translationId, interpolateParams, interpolationId, defaultTranslationText) {
          var deferred = $q.defer();
          var table = $uses ? $translationTable[$uses] : $translationTable,
              Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;
          if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
            var translation = table[translationId];
            if (translation.substr(0, 2) === '@:') {
              $translate(translation.substr(2), interpolateParams, interpolationId, defaultTranslationText).then(deferred.resolve, deferred.reject);
            } else {
              deferred.resolve(Interpolator.interpolate(translation, interpolateParams));
            }
          } else {
            var missingTranslationHandlerTranslation;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams);
            }
            if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
              fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText).then(function(translation) {
                deferred.resolve(translation);
              }, function(_translationId) {
                deferred.reject(applyNotFoundIndicators(_translationId));
              });
            } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
              if (defaultTranslationText) {
                deferred.resolve(defaultTranslationText);
              } else {
                deferred.resolve(missingTranslationHandlerTranslation);
              }
            } else {
              if (defaultTranslationText) {
                deferred.resolve(defaultTranslationText);
              } else {
                deferred.reject(applyNotFoundIndicators(translationId));
              }
            }
          }
          return deferred.promise;
        };
        var determineTranslationInstant = function(translationId, interpolateParams, interpolationId) {
          var result,
              table = $uses ? $translationTable[$uses] : $translationTable,
              Interpolator = defaultInterpolator;
          if (interpolatorHashMap && Object.prototype.hasOwnProperty.call(interpolatorHashMap, interpolationId)) {
            Interpolator = interpolatorHashMap[interpolationId];
          }
          if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
            var translation = table[translationId];
            if (translation.substr(0, 2) === '@:') {
              result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId);
            } else {
              result = Interpolator.interpolate(translation, interpolateParams);
            }
          } else {
            var missingTranslationHandlerTranslation;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams);
            }
            if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
              fallbackIndex = 0;
              result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator);
            } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
              result = missingTranslationHandlerTranslation;
            } else {
              result = applyNotFoundIndicators(translationId);
            }
          }
          return result;
        };
        var clearNextLangAndPromise = function(key) {
          if ($nextLang === key) {
            $nextLang = undefined;
          }
          langPromises[key] = undefined;
        };
        $translate.preferredLanguage = function(langKey) {
          if (langKey) {
            setupPreferredLanguage(langKey);
          }
          return $preferredLanguage;
        };
        $translate.cloakClassName = function() {
          return $cloakClassName;
        };
        $translate.fallbackLanguage = function(langKey) {
          if (langKey !== undefined && langKey !== null) {
            fallbackStack(langKey);
            if ($loaderFactory) {
              if ($fallbackLanguage && $fallbackLanguage.length) {
                for (var i = 0,
                    len = $fallbackLanguage.length; i < len; i++) {
                  if (!langPromises[$fallbackLanguage[i]]) {
                    langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
                  }
                }
              }
            }
            $translate.use($translate.use());
          }
          if ($fallbackWasString) {
            return $fallbackLanguage[0];
          } else {
            return $fallbackLanguage;
          }
        };
        $translate.useFallbackLanguage = function(langKey) {
          if (langKey !== undefined && langKey !== null) {
            if (!langKey) {
              startFallbackIteration = 0;
            } else {
              var langKeyPosition = indexOf($fallbackLanguage, langKey);
              if (langKeyPosition > -1) {
                startFallbackIteration = langKeyPosition;
              }
            }
          }
        };
        $translate.proposedLanguage = function() {
          return $nextLang;
        };
        $translate.storage = function() {
          return Storage;
        };
        $translate.use = function(key) {
          if (!key) {
            return $uses;
          }
          var deferred = $q.defer();
          $rootScope.$emit('$translateChangeStart', {language: key});
          var aliasedKey = negotiateLocale(key);
          if (aliasedKey) {
            key = aliasedKey;
          }
          if (($forceAsyncReloadEnabled || !$translationTable[key]) && $loaderFactory && !langPromises[key]) {
            $nextLang = key;
            langPromises[key] = loadAsync(key).then(function(translation) {
              translations(translation.key, translation.table);
              deferred.resolve(translation.key);
              useLanguage(translation.key);
              return translation;
            }, function(key) {
              $rootScope.$emit('$translateChangeError', {language: key});
              deferred.reject(key);
              $rootScope.$emit('$translateChangeEnd', {language: key});
              return $q.reject(key);
            });
            langPromises[key]['finally'](function() {
              clearNextLangAndPromise(key);
            });
          } else if ($nextLang === key && langPromises[key]) {
            langPromises[key].then(function(translation) {
              deferred.resolve(translation.key);
              return translation;
            }, function(key) {
              deferred.reject(key);
              return $q.reject(key);
            });
          } else {
            deferred.resolve(key);
            useLanguage(key);
          }
          return deferred.promise;
        };
        $translate.storageKey = function() {
          return storageKey();
        };
        $translate.isPostCompilingEnabled = function() {
          return $postCompilingEnabled;
        };
        $translate.isForceAsyncReloadEnabled = function() {
          return $forceAsyncReloadEnabled;
        };
        $translate.refresh = function(langKey) {
          if (!$loaderFactory) {
            throw new Error('Couldn\'t refresh translation table, no loader registered!');
          }
          var deferred = $q.defer();
          function resolve() {
            deferred.resolve();
            $rootScope.$emit('$translateRefreshEnd', {language: langKey});
          }
          function reject() {
            deferred.reject();
            $rootScope.$emit('$translateRefreshEnd', {language: langKey});
          }
          $rootScope.$emit('$translateRefreshStart', {language: langKey});
          if (!langKey) {
            var tables = [],
                loadingKeys = {};
            if ($fallbackLanguage && $fallbackLanguage.length) {
              for (var i = 0,
                  len = $fallbackLanguage.length; i < len; i++) {
                tables.push(loadAsync($fallbackLanguage[i]));
                loadingKeys[$fallbackLanguage[i]] = true;
              }
            }
            if ($uses && !loadingKeys[$uses]) {
              tables.push(loadAsync($uses));
            }
            var allTranslationsLoaded = function(tableData) {
              $translationTable = {};
              angular.forEach(tableData, function(data) {
                translations(data.key, data.table);
              });
              if ($uses) {
                useLanguage($uses);
              }
              resolve();
            };
            allTranslationsLoaded.displayName = 'refreshPostProcessor';
            $q.all(tables).then(allTranslationsLoaded, reject);
          } else if ($translationTable[langKey]) {
            var oneTranslationsLoaded = function(data) {
              translations(data.key, data.table);
              if (langKey === $uses) {
                useLanguage($uses);
              }
              resolve();
            };
            oneTranslationsLoaded.displayName = 'refreshPostProcessor';
            loadAsync(langKey).then(oneTranslationsLoaded, reject);
          } else {
            reject();
          }
          return deferred.promise;
        };
        $translate.instant = function(translationId, interpolateParams, interpolationId) {
          if (translationId === null || angular.isUndefined(translationId)) {
            return translationId;
          }
          if (angular.isArray(translationId)) {
            var results = {};
            for (var i = 0,
                c = translationId.length; i < c; i++) {
              results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId);
            }
            return results;
          }
          if (angular.isString(translationId) && translationId.length < 1) {
            return translationId;
          }
          if (translationId) {
            translationId = trim.apply(translationId);
          }
          var result,
              possibleLangKeys = [];
          if ($preferredLanguage) {
            possibleLangKeys.push($preferredLanguage);
          }
          if ($uses) {
            possibleLangKeys.push($uses);
          }
          if ($fallbackLanguage && $fallbackLanguage.length) {
            possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
          }
          for (var j = 0,
              d = possibleLangKeys.length; j < d; j++) {
            var possibleLangKey = possibleLangKeys[j];
            if ($translationTable[possibleLangKey]) {
              if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
                result = determineTranslationInstant(translationId, interpolateParams, interpolationId);
              } else if ($notFoundIndicatorLeft || $notFoundIndicatorRight) {
                result = applyNotFoundIndicators(translationId);
              }
            }
            if (typeof result !== 'undefined') {
              break;
            }
          }
          if (!result && result !== '') {
            result = defaultInterpolator.interpolate(translationId, interpolateParams);
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              result = translateByHandler(translationId, interpolateParams);
            }
          }
          return result;
        };
        $translate.versionInfo = function() {
          return version;
        };
        $translate.loaderCache = function() {
          return loaderCache;
        };
        $translate.directivePriority = function() {
          return directivePriority;
        };
        $translate.statefulFilter = function() {
          return statefulFilter;
        };
        if ($loaderFactory) {
          if (angular.equals($translationTable, {})) {
            $translate.use($translate.use());
          }
          if ($fallbackLanguage && $fallbackLanguage.length) {
            var processAsyncResult = function(translation) {
              translations(translation.key, translation.table);
              $rootScope.$emit('$translateChangeEnd', {language: translation.key});
              return translation;
            };
            for (var i = 0,
                len = $fallbackLanguage.length; i < len; i++) {
              var fallbackLanguageId = $fallbackLanguage[i];
              if ($forceAsyncReloadEnabled || !$translationTable[fallbackLanguageId]) {
                langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
              }
            }
          }
        }
        return $translate;
      }];
    }
    $translate.$inject = ['$STORAGE_KEY', '$windowProvider', '$translateSanitizationProvider', 'pascalprechtTranslateOverrider'];
    $translate.displayName = 'displayName';
    angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', $translateDefaultInterpolation);
    function $translateDefaultInterpolation($interpolate, $translateSanitization) {
      'use strict';
      var $translateInterpolator = {},
          $locale,
          $identifier = 'default';
      $translateInterpolator.setLocale = function(locale) {
        $locale = locale;
      };
      $translateInterpolator.getInterpolationIdentifier = function() {
        return $identifier;
      };
      $translateInterpolator.useSanitizeValueStrategy = function(value) {
        $translateSanitization.useStrategy(value);
        return this;
      };
      $translateInterpolator.interpolate = function(string, interpolationParams) {
        interpolationParams = interpolationParams || {};
        interpolationParams = $translateSanitization.sanitize(interpolationParams, 'params');
        var interpolatedText = $interpolate(string)(interpolationParams);
        interpolatedText = $translateSanitization.sanitize(interpolatedText, 'text');
        return interpolatedText;
      };
      return $translateInterpolator;
    }
    $translateDefaultInterpolation.$inject = ['$interpolate', '$translateSanitization'];
    $translateDefaultInterpolation.displayName = '$translateDefaultInterpolation';
    angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');
    angular.module('pascalprecht.translate').directive('translate', translateDirective);
    function translateDirective($translate, $q, $interpolate, $compile, $parse, $rootScope) {
      'use strict';
      var trim = function() {
        return this.toString().replace(/^\s+|\s+$/g, '');
      };
      return {
        restrict: 'AE',
        scope: true,
        priority: $translate.directivePriority(),
        compile: function(tElement, tAttr) {
          var translateValuesExist = (tAttr.translateValues) ? tAttr.translateValues : undefined;
          var translateInterpolation = (tAttr.translateInterpolation) ? tAttr.translateInterpolation : undefined;
          var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);
          var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)',
              watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';
          return function linkFn(scope, iElement, iAttr) {
            scope.interpolateParams = {};
            scope.preText = '';
            scope.postText = '';
            var translationIds = {};
            var initInterpolationParams = function(interpolateParams, iAttr, tAttr) {
              if (iAttr.translateValues) {
                angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
              }
              if (translateValueExist) {
                for (var attr in tAttr) {
                  if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                    var attributeName = angular.lowercase(attr.substr(14, 1)) + attr.substr(15);
                    interpolateParams[attributeName] = tAttr[attr];
                  }
                }
              }
            };
            var observeElementTranslation = function(translationId) {
              if (angular.isFunction(observeElementTranslation._unwatchOld)) {
                observeElementTranslation._unwatchOld();
                observeElementTranslation._unwatchOld = undefined;
              }
              if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
                var interpolateMatches = trim.apply(iElement.text()).match(interpolateRegExp);
                if (angular.isArray(interpolateMatches)) {
                  scope.preText = interpolateMatches[1];
                  scope.postText = interpolateMatches[3];
                  translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
                  var watcherMatches = iElement.text().match(watcherRegExp);
                  if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
                    observeElementTranslation._unwatchOld = scope.$watch(watcherMatches[2], function(newValue) {
                      translationIds.translate = newValue;
                      updateTranslations();
                    });
                  }
                } else {
                  translationIds.translate = iElement.text().replace(/^\s+|\s+$/g, '');
                }
              } else {
                translationIds.translate = translationId;
              }
              updateTranslations();
            };
            var observeAttributeTranslation = function(translateAttr) {
              iAttr.$observe(translateAttr, function(translationId) {
                translationIds[translateAttr] = translationId;
                updateTranslations();
              });
            };
            initInterpolationParams(scope.interpolateParams, iAttr, tAttr);
            var firstAttributeChangedEvent = true;
            iAttr.$observe('translate', function(translationId) {
              if (typeof translationId === 'undefined') {
                observeElementTranslation('');
              } else {
                if (translationId !== '' || !firstAttributeChangedEvent) {
                  translationIds.translate = translationId;
                  updateTranslations();
                }
              }
              firstAttributeChangedEvent = false;
            });
            for (var translateAttr in iAttr) {
              if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr') {
                observeAttributeTranslation(translateAttr);
              }
            }
            iAttr.$observe('translateDefault', function(value) {
              scope.defaultText = value;
            });
            if (translateValuesExist) {
              iAttr.$observe('translateValues', function(interpolateParams) {
                if (interpolateParams) {
                  scope.$parent.$watch(function() {
                    angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
                  });
                }
              });
            }
            if (translateValueExist) {
              var observeValueAttribute = function(attrName) {
                iAttr.$observe(attrName, function(value) {
                  var attributeName = angular.lowercase(attrName.substr(14, 1)) + attrName.substr(15);
                  scope.interpolateParams[attributeName] = value;
                });
              };
              for (var attr in iAttr) {
                if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                  observeValueAttribute(attr);
                }
              }
            }
            var updateTranslations = function() {
              for (var key in translationIds) {
                if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
                  updateTranslation(key, translationIds[key], scope, scope.interpolateParams, scope.defaultText);
                }
              }
            };
            var updateTranslation = function(translateAttr, translationId, scope, interpolateParams, defaultTranslationText) {
              if (translationId) {
                $translate(translationId, interpolateParams, translateInterpolation, defaultTranslationText).then(function(translation) {
                  applyTranslation(translation, scope, true, translateAttr);
                }, function(translationId) {
                  applyTranslation(translationId, scope, false, translateAttr);
                });
              } else {
                applyTranslation(translationId, scope, false, translateAttr);
              }
            };
            var applyTranslation = function(value, scope, successful, translateAttr) {
              if (translateAttr === 'translate') {
                if (!successful && typeof scope.defaultText !== 'undefined') {
                  value = scope.defaultText;
                }
                iElement.html(scope.preText + value + scope.postText);
                var globallyEnabled = $translate.isPostCompilingEnabled();
                var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
                var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
                if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
                  $compile(iElement.contents())(scope);
                }
              } else {
                if (!successful && typeof scope.defaultText !== 'undefined') {
                  value = scope.defaultText;
                }
                var attributeName = iAttr.$attr[translateAttr];
                if (attributeName.substr(0, 5) === 'data-') {
                  attributeName = attributeName.substr(5);
                }
                attributeName = attributeName.substr(15);
                iElement.attr(attributeName, value);
              }
            };
            if (translateValuesExist || translateValueExist || iAttr.translateDefault) {
              scope.$watch('interpolateParams', updateTranslations, true);
            }
            var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);
            if (iElement.text().length) {
              if (iAttr.translate) {
                observeElementTranslation(iAttr.translate);
              } else {
                observeElementTranslation('');
              }
            } else if (iAttr.translate) {
              observeElementTranslation(iAttr.translate);
            }
            updateTranslations();
            scope.$on('$destroy', unbind);
          };
        }
      };
    }
    translateDirective.$inject = ['$translate', '$q', '$interpolate', '$compile', '$parse', '$rootScope'];
    translateDirective.displayName = 'translateDirective';
    angular.module('pascalprecht.translate').directive('translateCloak', translateCloakDirective);
    function translateCloakDirective($rootScope, $translate) {
      'use strict';
      return {compile: function(tElement) {
          var applyCloak = function() {
            tElement.addClass($translate.cloakClassName());
          },
              removeCloak = function() {
                tElement.removeClass($translate.cloakClassName());
              },
              removeListener = $rootScope.$on('$translateChangeEnd', function() {
                removeCloak();
                removeListener();
                removeListener = null;
              });
          applyCloak();
          return function linkFn(scope, iElement, iAttr) {
            if (iAttr.translateCloak && iAttr.translateCloak.length) {
              iAttr.$observe('translateCloak', function(translationId) {
                $translate(translationId).then(removeCloak, applyCloak);
              });
            }
          };
        }};
    }
    translateCloakDirective.$inject = ['$rootScope', '$translate'];
    translateCloakDirective.displayName = 'translateCloakDirective';
    angular.module('pascalprecht.translate').filter('translate', translateFilterFactory);
    function translateFilterFactory($parse, $translate) {
      'use strict';
      var translateFilter = function(translationId, interpolateParams, interpolation) {
        if (!angular.isObject(interpolateParams)) {
          interpolateParams = $parse(interpolateParams)(this);
        }
        return $translate.instant(translationId, interpolateParams, interpolation);
      };
      if ($translate.statefulFilter()) {
        translateFilter.$stateful = true;
      }
      return translateFilter;
    }
    translateFilterFactory.$inject = ['$parse', '$translate'];
    translateFilterFactory.displayName = 'translateFilterFactory';
    angular.module('pascalprecht.translate').factory('$translationCache', $translationCache);
    function $translationCache($cacheFactory) {
      'use strict';
      return $cacheFactory('translations');
    }
    $translationCache.$inject = ['$cacheFactory'];
    $translationCache.displayName = '$translationCache';
    return 'pascalprecht.translate';
  }));
})(require("process"));
