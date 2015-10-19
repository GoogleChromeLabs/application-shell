/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('copy:watch', function() {
  gulp.watch(GLOBAL.config.src + '/*.*', ['copy:root']);
});

gulp.task('copy:cleanRoot', function(cb) {
  del([GLOBAL.config.dest + '/*.{json,txt,ico}'], {dot: true})
    .then(function() {
      cb();
    });
});

gulp.task('copy:root', ['copy:cleanRoot'], function() {
  return gulp.src([
      GLOBAL.config.src + '/*.{json,txt,ico}',
    ])
    .pipe(gulp.dest(GLOBAL.config.dest));
});

gulp.task('copy', function(cb) {
  runSequence(
    'copy:root',
  cb);
});
