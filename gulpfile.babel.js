
import gulp from 'gulp';
import size from 'gulp-size';
import stylus from 'gulp-stylus';
import htmlmin from 'gulp-htmlmin';
import gutil, { noop } from 'gulp-util';
import rollup from 'rollup-stream';
import rollupBabel from 'rollup-plugin-babel';
import uglify from 'gulp-uglify';
import replace from 'gulp-replace';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import del from 'del';

/**
 * For dev:
 * $ gulp --dev
 *
 * For prod:
 * gulp
 */

// Compiles styl files into css.
gulp.task('css', () => (
  gulp
    .src('src/css/index.styl')
    .pipe(stylus({
      compress: !gutil.env.dev,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
));

// Minifies html.
gulp.task('html', () => (
  gulp
    .src('src/html/index.html')
    // Hash on assets. eg: 'index.css' -> 'index.css?a1b2c3'
    .pipe(replace(
      /(\.js|\.css)\b/g,
      `$1?${Math.random().toString(36).substr(2, 5)}`,
    ))
    .pipe(gutil.env.dev ? noop() : htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
));

// Transpiles and bundles js with rollup.
gulp.task('js', () => (
  rollup({
    entry: 'src/js/index.js',
    format: 'iife',
    plugins: [
      rollupBabel({
        exclude: 'node_modules/**',
      }),
    ],
  })
    .on('error', gutil.log)
    .pipe(source('index.js', 'src/js'))
    .pipe(buffer())
    .pipe(gutil.env.dev ? noop() : uglify())
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
));

// Copies assets to the dist folder.
gulp.task('assets', () => (
  gulp
    .src('assets/**/*')
    .pipe(gulp.dest('dist/'))
));

// Clears out the dist folder from any previous build.
gulp.task('clean-dist', () => (
  del([
    'dist/**/*',
    '!dist/.gitkeep',
  ])
));

// Watch task for css, js and html.
gulp.task('watch', () => {
  gulp.watch(['src/**/*.css', 'src/**/*.styl'], ['css']);
  gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['js']);
  gulp.watch('src/**/*.html', ['html']);
});

// Builds all in dist. Call with --watch to start watching.
gulp.task('default', ['clean-dist'], () => {
  gulp.start(['html', 'js', 'css', 'assets']);

  if (gutil.env.watch || gutil.env.dev) {
    gulp.start('watch');
  }
});
