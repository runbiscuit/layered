'use strict';

var argv = require('yargs').argv;

var gulp = require('gulp'),
	_if = require('gulp-if'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	pug = require('gulp-pug'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	filter = require('gulp-filter'),
	gulpMerge = require('gulp-merge');

var YOUR_LOCALS = {};

var PUG_DIR = './',
	PUG_DIR_FILES = PUG_DIR + '/*.pug',

	SASS_DIR = './resources/css',
	SASS_DIR_INPUT = SASS_DIR + '/raw/*.sass',
	SASS_DIR_OUTPUT = SASS_DIR + '/*.css',

	UGLIFY_DIR = './resources/js',
	UGLIFY_INPUT_FILES = UGLIFY_DIR + '/raw/**/*.js',
	UGLIFY_OUTPUT_FILES = UGLIFY_DIR;

gulp.task('pug', function () {
	gulp.src(PUG_DIR_FILES)
		.pipe(pug({
			locals: YOUR_LOCALS
	}))
	.pipe(gulp.dest(PUG_DIR));
});

gulp.task('sass', function () {
	return gulpMerge(
			gulp.src(SASS_DIR_INPUT).pipe(sass.sync().on('error', sass.logError)),
			gulp.src([
				// 'bower_components/materialIcons/materialIcons.css',
			])
		)
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'Opera 12.1'],
			casade: true
		}))
		.pipe(_if(argv.production, cleanCSS({compatibility: 'ie8'})))
		.pipe(gulp.dest(SASS_DIR));
});

gulp.task('js', function() {
	return gulpMerge(
			gulp.src([
				'bower_components/jquery/dist/jquery.min.js',
				'bower_components/materialize/bin/materialize.js',
				'bower_components/js-storage/js.storage.js',
				// 'bower_components/Waves/dist/waves.min.js'
			]), gulp.src(UGLIFY_INPUT_FILES)
		)
		.pipe(_if(argv.production, uglify()))
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(UGLIFY_OUTPUT_FILES));
});

gulp.task('build', [ 'pug', 'sass', 'js' ]);

gulp.task('launch', function () {
	console.log('\r\n                     *      .--.\r\n                           \/ \/  `\r\n          +               | |\r\n                 \'         \\ \\__,\r\n             *          +   \'--\'  *\r\n                 +   \/\\\r\n    +              .\'  \'.   *\r\n           *      \/======\\      +\r\n                 ;:.  _   ;\r\n                 |:. (_)  |\r\n                 |:.  _   |\r\n       +         |:. (_)  |          *\r\n                 ;:.      ;\r\n               .\' \\:.    \/ `.\r\n              \/ .-\'\':._.\'`-. \\\r\n              |\/    \/||\\    \\|\r\n            _..--\"\"\"````\"\"\"--.._\r\n      _.-\'``                    ``\'-._\r\n    -\'         Hello, explorer!       \'-\r\n\n                  LIFT OFF! \n');

	gulp.watch(PUG_DIR_FILES, ['pug']);
	gulp.watch(SASS_DIR_INPUT, ['sass']);
	gulp.watch(UGLIFY_INPUT_FILES, ['js']);
});
