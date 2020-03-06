var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyes'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	ftp = require('vinyl-ftp'),
	notify = require("gulp-notify"),
	rsync = require('gulp-rsync'),
	pug = require('gulp-pug');

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		//tunnel: true,
		//tunnel: "gulphtml", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// Пользовательские скрипты проекта

gulp.task('common-js', function () {
	return gulp.src([
		'app/js/common.js',
	])
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['common-js'], function () {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/slick/slick.min.js',
		'app/js/common.min.js', // Всегда в конце
	])
		.pipe(concat('scripts.min.js'))
		//.pipe(uglify.minify()) // Минимизировать весь js (на выбор)
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS()) // Опционально, закомментировать при отладке
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
});

gulp.task('pug', function buildHTML() {
	return gulp.src('app/pug/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.stream());
});

gulp.task('watch', ['sass', 'pug', 'js', 'browser-sync'], function () {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin())) // Cache Images
		.pipe(gulp.dest('build/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function () {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
	]).pipe(gulp.dest('build'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
	]).pipe(gulp.dest('build/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
	]).pipe(gulp.dest('build/js'));

});

gulp.task('deploy', function () {

	var conn = ftp.create({
		host: 'hostname.com',
		user: 'username',
		password: 'userpassword',
		parallel: 10,
		log: gutil.log
	});

	var globs = [
		'build/**',
		'build/.htaccess',
	];
	return gulp.src(globs, { buffer: false })
		.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function () {
	return gulp.src('build/**')
		.pipe(rsync({
			root: 'build/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}));
});

gulp.task('removedist', function () { return del.sync('build'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
