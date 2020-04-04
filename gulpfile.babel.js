
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

import { gaTrackingId } from './config';

const rollup = require('rollup');

const compileStyl = () => (
  gulp
    .src('src/css/index.styl')
    .pipe(stylus({
      compress: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
);

const minifyHtml = () => (
  gulp
    .src('src/html/index.html')
    // Hash on assets. eg: 'index.css' -> 'index.css?a1b2c3'
    .pipe(replace(
      /(\.js|\.css)\b/g,
      `$1?${Math.random().toString(36).substr(2, 5)}`,
    ))
    // GA tracking ID loaded from config.
    .pipe(!gaTrackingId ? through.obj() : replace(
      /UA-XXXXXXXX-X/g,
      gaTrackingId,
    ))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
);

const compileJs = () => (
  rollup.rollup({
    input: 'src/js/index.js',
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

const copyAssets = () => (
  gulp
    .src('assets/**/*')
    .pipe(gulp.dest('dist/'))
);

const cleanDist = () => (
  del([
    'dist/**/*',
    '!dist/.gitkeep',
  ])
);

exports.cleanDist = gulp.task(cleanDist);

exports.build = gulp.series(
  cleanDist,
  gulp.parallel(
    minifyHtml,
    compileJs,
    compileStyl,
    copyAssets,
  ),
);

exports.watch = () => {
  gulp.watch(['src/**/*.css', 'src/**/*.styl'], compileStyl);
  gulp.watch(['src/**/*.js', 'src/**/*.jsx'], compileJs);
  gulp.watch('src/**/*.html', minifyHtml);
};
