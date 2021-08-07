const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');

// const distPath = 'dist/';
const distPath = 'C:/OpenServer/domains/nk.loc/assets/app/';

function scripts() {
	return src([
		'./node_modules/swiper/swiper-bundle.min.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(dest('src/js/'))
		.pipe(browserSync.stream())
}

function browsersync() {
	browserSync.init({
		server: { baseDir: 'src/' },
		notify: false,
		online: true
	})
}

function styles() {
	return src('src/sass/**/*.sass')
		.pipe(sass())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleanCss(({ format: 'beautify' })))
		.pipe(dest('src/css/'))
		.pipe(browserSync.stream())
}

function csslibs() {
	return src('src/css/libs.css')
		.pipe(cleanCss(({ level: { 1: { specialComments: 0 } } })))
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest('src/css/'))
}

function images() {
	return src('src/img/**/*')
		.pipe(cache(imagemin()))
		.pipe(dest(`${distPath}img/`))
}

function clear() {
	return cache.clearAll();
}

function clean() {
	return del([distPath], { force: true });
}

function startwatch() {
	watch('src/sass/**/*.sass', styles);
	watch('src/*.html').on('change', browserSync.reload);
	watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
}

function build() {
	return src([
		'src/**',
		'!src/libs',
		'!src/libs/**',
		'!src/sass',
		'!src/sass/**',
		'!src/css/libs.css',
		'!src/css/*.map'
	], { base: 'src/', allowEmpty: true })
		.pipe(dest(distPath));
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.csslibs = csslibs;
exports.images = images;
exports.clear = clear;
exports.clean = clean;
exports.build = series(clean, clear, styles, csslibs, scripts, images, build);

exports.default = parallel(styles, csslibs, scripts, browsersync, startwatch);