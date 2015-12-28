var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function() {
  return nodemon({
    script: 'app.js'
  });
});
