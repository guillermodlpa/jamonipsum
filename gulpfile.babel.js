
import gulp from 'gulp';
import size from 'gulp-size';
import stylus from 'gulp-stylus';
import file from 'gulp-file';
import htmlmin from 'gulp-htmlmin';
import rollupBabel from 'rollup-plugin-babel';
import uglify from 'gulp-uglify';
import replace from 'gulp-replace';
import buffer from 'vinyl-buffer';
import del from 'del';
import through from 'through2';

const rollup = require('rollup');
require('dotenv').config();

const compileSiteStyl = () => (
  gulp
    .src('site/css/index.styl')
    .pipe(stylus({
      compress: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
);

const minifySiteHtml = () => (
  gulp
    .src('site/html/index.html')
    // Hash on assets. eg: 'index.css' -> 'index.css?a1b2c3'
    .pipe(replace(
      /(\.js|\.css)\b/g,
      `$1?${Math.random().toString(36).substr(2, 5)}`,
    ))
    // GA tracking ID loaded from config.
    .pipe(!process.env.GOOGLE_ANALYTICS_TRACKING_ID ? through.obj() : replace(
      /__GOOGLE_ANALYTICS_TRACKING_ID__/g,
      process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    ))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
);

const bundleSiteJs = () => (
  rollup.rollup({
    input: 'site/js/index.js',
    plugins: [
      rollupBabel({
        exclude: 'node_modules/**',
      }),
    ],
  })
    .then((bundle) => bundle.generate({
      format: 'umd',
    }))
    .then((gen) => {
      /** @var {string} */
      const bundleContents = gen.output[0].code;

      return file('index.js', bundleContents, { src: true })
        .pipe(buffer())
        .pipe(uglify())
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest('dist/'));
    })
);

const copySiteAssets = () => (
  gulp
    .src('site/assets/**/*')
    .pipe(gulp.dest('dist/'))
);

const cleanDist = () => (
  del([
    'dist/**/*',
  ])
);

exports.cleanDist = gulp.task(cleanDist);

exports.build = gulp.series(
  cleanDist,
  gulp.parallel(
    minifySiteHtml,
    bundleSiteJs,
    compileSiteStyl,
    copySiteAssets,
  ),
);

exports.watch = () => {
  gulp.watch(['site/**/*.css', 'site/**/*.styl'], compileSiteStyl);
  gulp.watch(['src/**/*.js', 'site/**/*.js'], bundleSiteJs);
  gulp.watch('site/**/*.html', minifySiteHtml);
};
