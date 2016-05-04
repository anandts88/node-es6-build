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
var changed         = require('gulp-changed');
var nodemon         = require('gulp-nodemon');

// Load Gulp plugins
var plugins = gulpLoadPlugins();

var paths = {
  jsFiles: './app/**/*.js',
  nonJsFiles: ['./package.json'],
  destination: 'dist'
};

function _clean(path) {
  del(path);
}

function _copy(source, destination) {
  return gulp.src(source)
		.pipe(plugins.newer(destination))
		.pipe(gulp.dest(destination));
}

function _jshint(path) {
  return gulp.src(path)
    .pipe(changed(paths.destination))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}

function _jscs(path) {
  return gulp.src(path)
    .pipe(jshint())
    .pipe(jscs())
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jscs.reporter());
}

function _babel(path, destination) {
  return gulp.src(path, { base: 'app' })
		.pipe(plugins.newer(destination))
    .pipe(changed(paths.destination))
		// .pipe(plugins.sourcemaps.init())
		.pipe(plugins.babel())
		/*.pipe(plugins.sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: function(file) {
				return path.relative(file.path, __dirname);
			}
		}))*/
		.pipe(gulp.dest(destination));

}

// Clean up dist directory
gulp.task('clean', function() {
  return _clean(['dist/**', '!dist']);
});

// Copy non-js files to dist directory
gulp.task('copy-non-js', function() {
  return _copy(paths.nonJsFiles, paths.destination);
});

// Lint Javascript
gulp.task('jshint', function() {
	return _jshint(paths.jsFiles);
});

// Lint Javascript
gulp.task('jscs', function () {
  return _jscs(paths.jsFiles);
});

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', function() {
  return _babel(paths.jsFiles, paths.destination);
});

// Start server with restart on file changes
gulp.task('nodemon', function() {
	return nodemon({
		script: path.join('dist', 'index.js'),
		ext: 'js',
		ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
		tasks: ['jshint', 'copy-non-js', 'babel'],
    env: { 'NODE_ENV': 'development' }
	});
});

// gulp serve for development
gulp.task('serve', function(cb) {
  runSequence('clean', 'jshint', 'copy-non-js', 'babel', 'nodemon', cb);
});

// default task: clean dist, compile js files using babel and copy non-js files into dist.
gulp.task('default', ['clean'], function() {
	runSequence(
		['jshint', 'copy-non-js', 'babel']
	);
});
