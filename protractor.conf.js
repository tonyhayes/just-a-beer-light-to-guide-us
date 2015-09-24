var configuration = {
  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  specs: ['e2e/spec.js'],

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 360000
  },
};

{
  configuration.baseUrl = 'http://localhost:9000';
  configuration.directConnect = true;
}

exports.config = configuration;
