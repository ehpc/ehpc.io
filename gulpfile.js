var gulp = require('gulp'),
	rename = require('gulp-rename'),
	less = require('gulp-less'),
	minifyCss = require('gulp-minify-css'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	del = require('del');

// Compile less to css
gulp.task('less', function () {
	return gulp
		.src(['less/**/*.less'])
		.pipe(less())
		.pipe(gulp.dest('public/css/'));
});

// Compile all index styles into one
gulp.task('compile-css-index', ['less'], function () {
	return gulp
		.src(['node_modules/normalize.css/normalize.css', 'public/css/index.css'])
		.pipe(concat('index.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('public/css/'));
});

//  Compile all blog styles into one
gulp.task('compile-css-blog', ['less'], function () {
	return gulp
		.src(['node_modules/normalize.css/normalize.css', 'public/css/blog.css'])
		.pipe(concat('blog.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('public/css/'));
});

// Compile all index-specific js
gulp.task('compile-js-index', function () {
	return gulp
		.src(['node_modules/tinycolor2/tinycolor.js', 'js/city-builder.js'])
		.pipe(concat('index.min.js'))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest('public/js/'));
});

// Compile all blog-specific js
gulp.task('compile-js-blog', function () {
	return gulp
		.src(['js/blog.js'])
		.pipe(concat('blog.min.js'))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest('public/js/'));
});

// Remove all temporary files
gulp.task('cleanup', ['compile-css-index', 'compile-js-index'], function () {
	return del([
		'public/css/index.css',
		'public/css/blog.css'
	]);
});

// Automated builds
gulp.task('watch', function () {
	watch(['less/**/*.less', '**/*.js', '**/*.ejs'], batch(function (events, done) {
		gulp.start('default', done);
	}));
});

// All at once
gulp.task('default', [
	'less',
	'compile-css-index',
	'compile-css-blog',
	'compile-js-index',
	'compile-js-blog',
	'cleanup'
]);
