/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var gulp = require('gulp');
var del = require('del');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');

gulp.task('images:watch', function() {
  gulp.watch(GLOBAL.config.src + '/images/**/*.*', ['images']);
});

gulp.task('images:clean', function(cb) {
  del([GLOBAL.config.dest + '/*.{png,jpg,jpeg,gif,svg}'], {dot: true})
    .then(function() {
      cb();
    });
});

gulp.task('images', ['images:clean'], function() {
  return gulp.src(GLOBAL.config.src + '/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(gulpif(GLOBAL.config.env == 'prod', imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
    })))
    .pipe(gulp.dest(GLOBAL.config.dest));
});
