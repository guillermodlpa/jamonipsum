
import gulp from 'gulp';
import size from 'gulp-size';
import stylus from 'gulp-stylus';
import htmlmin from 'gulp-htmlmin';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import rollup from 'rollup-stream';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import del from 'del';

gulp.task('css', () => (
  gulp
    .src('src/css/index.styl')
    .pipe(stylus({
      compress: true,
    }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
));

gulp.task('html', () => (
  gulp
    .src('src/html/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
));

gulp.task('js', () => (
  rollup({
      entry: 'src/js/index.js',
      format: 'iife',
   })
    .pipe(source('index.js', 'src/js'))
    .pipe(buffer())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('dist/'))
));

gulp.task('assets', () => (
  gulp
    .src('assets/**/*')
    .pipe(gulp.dest('dist/'))
));

gulp.task('clear-dist', () => (
  del([
    'dist/**/*',
    '!dist/.gitkeep'
  ])
));

gulp.task('watch', () => {
    gulp.watch(['src/**/*.css', 'src/**/*.styl'], ['css']);
    gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['js']);
    gulp.watch('src/**/*.html', ['html']);
});

gulp.task('default', ['clear-dist'], () => {
  gulp.start(['html','js', 'css', 'assets']);

  if (gutil.env.watch) {
    gulp.start('watch');
  }
});
