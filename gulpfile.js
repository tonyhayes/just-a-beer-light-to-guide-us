var Promise = require('promise'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    combine = require('stream-combiner2'),
    karma = require('karma').server,
    $ = require('gulp-load-plugins')();
cachebust = new $.cachebust;



var startServer = function() {
    return new Promise(function(fulfil) {
        gulp.src('./')
            .pipe($.webserver({
                host: "0.0.0.0",
                port: 9000,
                livereload: true,
                fallback: 'index.html'
            }))
            .on('end', fulfil);
    });
};
gulp.task('styles', function() {
    var combined = combine.obj([
        gulp.src('./promo-manager/layout-view/styles/layout-styles.less')
            .pipe(plumber())
            .pipe(less())
            .pipe(gulp.dest('promo-manager/layout-view/styles'))
            ]);
            // any errors in the above streams will get caught
            // by this listener, instead of being thrown:
    combined.on('error', console.error.bind(console));

//    return combined;

});
gulp.task('tests', function(done) {
  return karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done);
});


gulp.task('default',
    function() {
        startServer();
        // watch for CSS changes
        gulp.watch(['./**/*.less'], ['styles']);
//        gulp.watch(['./**/*.*'], ['tests']);

    });



