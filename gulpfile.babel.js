
import gulp from 'gulp';
import size from 'gulp-size';
import stylus from 'gulp-stylus';
import file from 'gulp-file';
import htmlmin from 'gulp-htmlmin';
import rollupBabel from 'rollup-plugin-babel';
import uglify from 'gulp-uglify';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import buffer from 'vinyl-buffer';
import del from 'del';
import through from 'through2';

const rollup = require('rollup');
require('dotenv').config();
const libraryName = require('./package.json').name;

const compileSiteStyl = () => (
  gulp
    .src('site/css/index.styl')
    .pipe(stylus({
      compress: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(rename('site.css'))
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

/**
 * @param {string} entryFilePath
 * @param {string} outputFilename
 * @return {Promise}
 */
const bundleJs = (entryFilePath, outputFilename) => (
  rollup.rollup({
    input: entryFilePath,
    plugins: [
      rollupBabel({
        exclude: 'node_modules/**',
      }),
    ],
  })
    .then((bundle) => bundle.generate({
      format: 'umd',
      name: libraryName,
    }))
    .then((gen) => {
      /** @var {string} */
      const bundleContents = gen.output[0].code;

      return file(outputFilename, bundleContents, { src: true })
        .pipe(buffer())
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify())
        .pipe(rename((path) => ({ ...path, extname: `.min${path.extname}` })))
        .pipe(gulp.dest('dist/'));
    })
);

const bundleSiteJs = () => bundleJs('site/js/index.js', 'site.js');
const bundleLibraryJs = () => bundleJs('src/index.js', 'main.js');

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
    bundleLibraryJs,
    compileSiteStyl,
    copySiteAssets,
  ),
);

exports.watch = () => {
  gulp.watch(['site/**/*.css', 'site/**/*.styl'], compileSiteStyl);
  gulp.watch(['src/**/*.js', 'site/**/*.js'], bundleSiteJs);
  gulp.watch(['src/**/*.js'], () => bundleLibraryJs);
  gulp.watch('site/**/*.html', minifySiteHtml);
};
