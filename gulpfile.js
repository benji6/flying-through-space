const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const buffer = require('vinyl-buffer')
const browserify = require('browserify')
const connect = require('gulp-connect')
const gulp = require('gulp')
const gutil = require('gulp-util')
const minifyCSS = require('gulp-minify-css')
const minifyHTML = require('gulp-minify-html')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const watchify = require('watchify')

const htmlPath = 'src/html/index.html'
const jsPath = 'src/js/main.js'
const sassPath = 'src/sass/style.scss'
const distPath = 'dist'

gulp.task('connect', () => {
  connect.server({livereload: true})
})

gulp.task('reload', () => {
  gulp.src(distPath).pipe(connect.reload())
})

gulp.task('html', () => {
  gulp.src(htmlPath)
    .pipe(minifyHTML())
    .pipe(gulp.dest(distPath))
})

gulp.task('jsDev', () => {
  const bundler = watchify(browserify(jsPath, Object.assign({}, watchify.args, {debug: true})))

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})

gulp.task('jsProd', () => {
  const bundler = browserify({
    entries: jsPath,
  })

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('sass', () => {
  gulp.src(sassPath)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 3 versions'],
      cascade: false,
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(distPath))
})

gulp.task('watch', () => {
  gulp.start('jsDev', 'html', 'sass', 'connect')
  gulp.watch('src/js/**/*.js', ['jsDev'])
  gulp.watch(htmlPath, ['html'])
  gulp.watch('src/sass/**/*.scss', ['sass'])
  gulp.watch(distPath, ['reload'])
})

gulp.task('build', ['jsProd', 'html', 'sass'])
gulp.task('default', ['watch'])
