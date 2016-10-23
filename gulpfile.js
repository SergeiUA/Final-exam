var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
concat = require('gulp-concat'),
uglify = require('gulp-uglifyjs'),
cssnano = require('gulp-cssnano'),
rename = require('gulp-rename'),
del = require('del'),
plumber = require('gulp-plumber'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
cache = require('gulp-cache'),
autoprefixer = require('gulp-autoprefixer'),
spritesmith = require('gulp.spritesmith');

gulp.task('sass', function() {
	return gulp.src(['src/sass/**/*.sass', 'src/sass/**/*.scss'])
	.pipe(plumber({
		errorHandler: function (err) {
			console.log(err);
			this.emit('end');
		}
	}))
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src(['src/plugins/jquery-3.1.0.min.js', 'src/plugins/owl.carousel.min.js', 'src/plugins/isotope.pkgd.min.js'])
	.pipe(concat('plugins.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src(['src/css/reset.css','src/css/main.css','src/css/owl.carousel.css'])
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('src/css'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', ['sprite'], function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		optimizationLevel: 3,
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src('src/sprite/*.*')
	.pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: '../img/sprite.png',
		cssName: '_sprite.sass',
		algorithm: 'binary-tree',
		cssTemplate: 'sass.template.handlebars'
	}));
	spriteData.img.pipe(gulp.dest('src/img/'));
	spriteData.css.pipe(gulp.dest('src/sass/'));
});

gulp.task('watch', ['browser-sync', 'sprite', 'sass', 'scripts'], function() {
	gulp.watch(['src/sass/**/*.sass', 'src/sass/**/*.scss'], ['sass']);
	gulp.watch('src/sprite/**/*', ['sprite']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
	var buildCss = gulp.src(['src/css/reset.css','src/css/main.css','src/css/owl.carousel.css', 'src/css/animate.css'])
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(concat('style.min.css'))
	.pipe(cssnano())
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src(['src/js/plugins.min.js', 'src/js/script.js'])
	.pipe(concat('script.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));

	var copyHtml = gulp.src('src/*.html')
	.pipe(gulp.dest('dist'));

	var copyIePlugins = gulp.src(['src/plugins/html5shiv.min.js', 'src/plugins/jquery1.9.1.min.js', 'src/plugins/owl.carousel.ie8+.min.js', 
		'src/plugins/respond.min.js', 'src/plugins/isotope-v2.pkgd.js', 'src/plugins/PIE.htc', 'src/plugins/PIE_IE678.js', 'src/plugins/PIE_IE9.js'])
	.pipe(gulp.dest('dist/plugins'));

	var copyIeScript = gulp.src('src/js/ie8+.js')
	.pipe(gulp.dest('dist/js'))

	var copyIeCss = gulp.src(['src/css/ie8.css', 'src/css/ie8+.css'])
	.pipe(gulp.dest('dist/css'))
});