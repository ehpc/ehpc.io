var gulp = require('gulp'),
	rename = require('gulp-rename'),
	less = require('gulp-less'),
	minifyCss = require('gulp-minify-css'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch');

// Make normalize available in public
gulp.task('normalize', function () {
	return gulp
		.src('node_modules/normalize.css/normalize.css')
		.pipe(minifyCss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/stylesheets/'));
});

// Compile less to css
gulp.task('less', function () {
	return gulp
		.src('less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('public/stylesheets/'));
});

// Automated builds
gulp.task('watch', function () {
	watch('less/**/*.less', batch(function (events, done) {
		gulp.start('less', done);
	}));
});

// All at once
gulp.task('default', ['normalize', 'less']);
