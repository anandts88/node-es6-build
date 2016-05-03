var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var runSequence     = require('run-sequence');
var path            = require('path');
var del             = require('del');
var jshint          = require('gulp-jshint');
var jscs            = require('gulp-jscs');
var jscsStylish     = require('gulp-jscs-stylish');
var livereload      = require('gulp-livereload');
var notify          = require('gulp-notify');

// Load Gulp plugins
var plugins = gulpLoadPlugins();

var paths = {
  jsFiles: './app/**/*.js',
  nonJsFiles: ['./package.json']
};

var onnodemon = ['jshint', 'copy', 'babel'];

// Clean up dist directory
gulp.task('clean', function() {
  del(['dist/**', '!dist']);
});

// Copy non-js files to dist directory
gulp.task('copy', function() {
	gulp.src(paths.nonJsFiles)
		.pipe(plugins.newer('dist'))
		.pipe(gulp.dest('dist'));
});

// Lint Javascript
gulp.task('jshint', function() {
	gulp.src(paths.jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Lint Javascript
gulp.task('jscs', function () {
	gulp.src(paths.jsFiles)
    .pipe(jshint())
		.pipe(jscs())
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jscs.reporter());
});

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', function() {
	gulp.src(paths.jsFiles, { base: 'app' })
		.pipe(plugins.newer('dist'))
		// .pipe(plugins.sourcemaps.init())
		.pipe(plugins.babel())
		/*.pipe(plugins.sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: function(file) {
				return path.relative(file.path, __dirname);
			}
		}))*/
		.pipe(gulp.dest('dist'));
});

// Start server with restart on file changes
gulp.task('nodemon', onnodemon, function() {
  //livereload.listen();

	plugins.nodemon({
		script: path.join('dist', 'index.js'),
		ext: 'js',
		ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
		tasks: onnodemon,
    env: { 'NODE_ENV': 'development' }
	})/*.on('restart', function() {
    gulp.src(path.join('dist', 'index.js'))
      .pipe(livereload())
      .pipe(notify('Reloading node-authentication...'))
  })*/;
});

// gulp serve for development
gulp.task('serve', ['clean'], function() {
  runSequence('nodemon');
});

// default task: clean dist, compile js files using babel and copy non-js files into dist.
gulp.task('default', ['clean'], function() {
	runSequence(
		['copy', 'babel']
	);
});
