import gulp     from 'gulp'
import del      from 'del'
import jshint   from 'gulp-jshint'
import babel    from 'gulp-babel'
import karma    from 'karma'


/* javascript */
gulp.task( 'javascript', () => {
  gulp.src( '_source/**/*.js' )
    .pipe(jshint({ asi: true, esversion: 6 }))
    .pipe(jshint.reporter('default'))
    .pipe(babel({ presets: [ 'es2015' ] }))
    .pipe(gulp.dest( '_build' ))
})


/* sync build */
gulp.task('sync:build', () => {
  gulp.src(['_source/**/*', '!_source/**/*.js']).pipe(gulp.dest( '_build' ))
})

/* tests */
gulp.task('tests', (done) => {
  new karma({
    configFile: require('path').resolve('./karma.conf.js')
  }, done).start()
})



/* default */
gulp.task('default', () => {

  gulp.watch(['_source/**/*'], (event) => {
    if (event.type === 'deleted') {
      del(event.path.replace(`${__dirname}/_source`, '_build'))
      del(event.path.replace(`${__dirname}/_source`, '_build').replace(/.([^.]*)$/, '.min.$1'))
    } else if (event.type === 'added') { gulp.start('sync:build') }
  })

  gulp.watch(['_build/**/*'], (event) => {
    if (event.type === 'deleted') {
      del(event.path.replace(`${__dirname}/`, '').replace(/.([^.]*)$/, '.min.$1'))
    }
  })

  gulp.watch('_source/**/*.js', ['javascript'])

})
