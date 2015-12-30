'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	jade = require('gulp-jade'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	obfuscate = require('gulp-obfuscate'),
	concat = require('gulp-concat');

var YOUR_LOCALS = {};

var JADE_DIR = './',
	JADE_DIR_FILES = JADE_DIR + '/*.jade',

	SASS_DIR = './resources/css',
	SASS_DIR_INPUT = SASS_DIR + '/*.sass',
	SASS_DIR_OUTPUT = SASS_DIR + '/*.css',

	UGLIFY_DIR = './resources/js',
	UGLIFY_INPUT_FILES = UGLIFY_DIR + '/raw/*.js',
	UGLIFY_OUTPUT_FILES = UGLIFY_DIR;

gulp.task('jade', function () {
	gulp.src(JADE_DIR_FILES)
		.pipe(jade({
			locals: YOUR_LOCALS,
			pretty: true
	}))
	.pipe(gulp.dest(JADE_DIR));
});

gulp.task('sass', function () {
	gulp.src(SASS_DIR_INPUT)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'Opera 12.1'],
			casade: true
		}))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest(SASS_DIR));
});

gulp.task('finalBuild', function() {
	return gulp.src(UGLIFY_INPUT_FILES)
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(UGLIFY_OUTPUT_FILES));
});

gulp.task('build', function() {
	return gulp.src(UGLIFY_INPUT_FILES)
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(UGLIFY_OUTPUT_FILES));
});

gulp.task('launch', function () {
	console.log('\r\n                     *      .--.\r\n                           \/ \/  `\r\n          +               | |\r\n                 \'         \\ \\__,\r\n             *          +   \'--\'  *\r\n                 +   \/\\\r\n    +              .\'  \'.   *\r\n           *      \/======\\      +\r\n                 ;:.  _   ;\r\n                 |:. (_)  |\r\n                 |:.  _   |\r\n       +         |:. (_)  |          *\r\n                 ;:.      ;\r\n               .\' \\:.    \/ `.\r\n              \/ .-\'\':._.\'`-. \\\r\n              |\/    \/||\\    \\|\r\n            _..--\"\"\"````\"\"\"--.._\r\n      _.-\'``                    ``\'-._\r\n    -\'         Hello, explorer!       \'-\r\n\n                  LIFT OFF! \n');

	gulp.watch(JADE_DIR_FILES, ['jade']);
	gulp.watch(SASS_DIR_INPUT, ['sass']);
	gulp.watch(UGLIFY_INPUT_FILES, ['build']);
});