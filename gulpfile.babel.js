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

/* sync build */
gulp.task('build', () => {
  gulp.src(['_source/**/*', '!_source/**/*.js']).pipe(gulp.dest('_build'))
})

/* tdd */
gulp.task('tdd', () => {
  return gulp.src('_tests/**/*.js', {read: false})
    .pipe(mocha({ reporter: 'nyan' }))
})

/* test once */
gulp.task('test', () => {
  return gulp.src('test.js')
    .pipe(mocha())
    .once('error', () => { process.exit(1) })
    .once('end', () => { process.exit() })
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
  gulp.watch('_source/**/*.js', ['javascript', 'tdd'])
})
