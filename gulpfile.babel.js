var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var runSequence     = require('run-sequence');
var path            = require('path');
var del             = require('del');
// Load Gulp plugins
var plugins = gulpLoadPlugins();

var paths = {
  baseDir: 'app',
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
    .pipe(plugins.changed(paths.destination))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
}

function _eslint(path) {
  return gulp.src(path)
    .pipe(plugins.changed(paths.destination))
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
}

function _babel(source, destination) {
  return gulp.src(source, { base: paths.baseDir })
		.pipe(plugins.newer(destination))
    .pipe(plugins.changed(paths.destination))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: function(file) {
        return file.cwd + '/' + paths.baseDir;
      }
    }))
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

// JSHint Javascript
gulp.task('jshint', function() {
	return _jshint(paths.jsFiles);
});

// ESLINT Javascript
gulp.task('eslint', function() {
  return _eslint(paths.jsFiles);
})

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
	return plugins.nodemon({
		script: path.join('dist', 'index.js'),
    exec: 'node-inspector & node --debug',
		ext: 'js',
		ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
		tasks: ['eslint', 'copy-non-js', 'babel'],
    env: { 'NODE_ENV': 'development' }
	});
});

// gulp serve for development
gulp.task('serve', function(cb) {
  runSequence('clean', 'eslint', 'copy-non-js', 'babel', 'nodemon', cb);
});

// default task: clean dist, compile js files using babel and copy non-js files into dist.
gulp.task('default', ['clean'], function() {
	runSequence(
		['eslint', 'copy-non-js', 'babel']
	);
});
