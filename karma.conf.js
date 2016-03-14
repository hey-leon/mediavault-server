module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      '_app/app.js',
      '_tests/**/*.js'
    ]
  })
}
