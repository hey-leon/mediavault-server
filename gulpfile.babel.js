import gulp from 'gulp'
import del from 'del'
import jshint from 'gulp-jshint'
import babel from 'gulp-babel'
import mocha from 'gulp-mocha'

/* javascript */
gulp.task('javascript', () => {
  gulp.src('_source/**/*.js')
    .pipe(jshint({ asi: true, esversion: 6 }))
    .pipe(jshint.reporter('default'))
    .pipe(babel({ presets: [ 'es2015' ] }))
    .pipe(gulp.dest('_build'))
})

/* test */
gulp.task('test', () => {
  return gulp.src('_tests/**/*.js', {read: false})
    .pipe(mocha({ reporter: 'nyan' }))
})

/* default */
gulp.task('default', () => {
  // syncs build tree with source tree
  gulp.watch(['_source/**/*'], (event) => {
    if (event.type === 'deleted') {
      del(event.path.replace(`${__dirname}/_source`, '_build'))
    } else if (event.type === 'added') { gulp.start('build') }
  })
  // automate js tasks
  gulp.watch('_source/**/*.js', ['javascript', 'test'])
})

/* ci test */
gulp.task('ci:test', () => {
  return gulp.src('test.js')
    .pipe(mocha())
    .once('error', () => { process.exit(1) })
    .once('end', () => { process.exit() })
})

/* ci build */
gulp.task('ci:build', ['javascript'])
