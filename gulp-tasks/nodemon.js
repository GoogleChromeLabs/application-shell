var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');

gulp.task('nodemon', function() {
  const PROD_PORT = 8080;
  const DEV_PORT = 8081;
  // This results in different ports for prod and dev
  var port = (GLOBAL.config.env === 'prod') ? PROD_PORT : DEV_PORT;
  env({
    vars: {
      PORT: port
    }
  });

  return nodemon({
    script: 'app.js'
  });
});
