var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	rename = require('gulp-rename'),
	beautify = require('gulp-jsbeautify'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	tabify = require('gulp-tabify'),
	prettify = require('gulp-prettify'),
	less = require('gulp-less'),
	svgSprite = require('gulp-svg-sprite');

gulp.task('libs-css', function() {
	return gulp.src('app/css/libs/*.css')
		.pipe(concat('libs.css'))
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false 
		}))
		.pipe(cssnano())
		.pipe(gulp.dest('app/css'));
});

gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe(prettify({
			unformatted: []
		}))
		.pipe(tabify(2, true))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('less', function() {
	return gulp.src('app/less/index.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false 
		}))
		.pipe(tabify(2, true))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('libs-js', function() {
	return gulp.src('app/js/libs/*.js')
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
	return gulp.src('app/img/*')
		.pipe(cache(imagemin({
			interlased: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'))
});

gulp.task('pic', function() {
	return gulp.src('app/pic/*')
		.pipe(cache(imagemin({
			interlased: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/pic'))
});

gulp.task('graphic', ['img', 'pic']);

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('watch', ['browser-sync', 'libs-css', 'less', 'html', 'scripts'], function() {
	gulp.watch('app/css/libs/*.css', ['libs-css']);
	setTimeout(function() {
		gulp.watch('app/less/*.less', ['less']);
	}, 100);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/js/*.js', ['scripts']);
});

gulp.task('fonts', function() {
	gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['watch']);

gulp.task('build', ['clean', 'libs-css', 'less', 'libs-js', 'scripts', 'html', 'graphic', 'fonts']);

gulp.task('svg', function() {
	return gulp.src(['mark-first.svg', 'mark-first-mini.svg', 'mark-last.svg', 'mark-last-mini.svg', 'logo.svg', 'basket.svg', 'basket-hover.svg', 'arrow-right.svg', 'arrow-right-hover.svg', 'arrow-down.svg', 'arrow-down-hover.svg'], { cwd: 'app/img/sprite/' })
		.pipe(svgSprite({
			shape: {
				spacing: {
					padding: 5
				}
			},
			mode: {
				css: {
					dimensions : true,
					bust: false,
					dest: '',
					render: {
						css: true
					}
				}
			}
		}))
		.pipe(gulp.dest('dist/img'));
});
gulp.task('symbols', function() {
	return gulp.src(['mark-first.svg', 'mark-first-mini.svg', 'mark-middle.svg', 'mark-middle-mini.svg', 'mark-last.svg', 'mark-last-mini.svg', 'logo.svg', 'basket.svg', 'basket-hover.svg', 'arrow-right.svg', 'arrow-right-hover.svg', 'arrow-down.svg', 'arrow-down-hover.svg', 'badges-left.svg', 'badges-right.svg'], { cwd: 'app/img/sprite/' })
		.pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: '../symbols-dev.svg'  //sprite file name
                    }
                },
            }
        ))
		.pipe(gulp.dest('dist/img'));
});