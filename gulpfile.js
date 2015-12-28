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

/**
 *
 * This is the Gulp build process file. Gulp allows you to create "tasks"
 * that can be chained together and will mutate the input before it's
 * served to a browser. For example, Javascript and Sass are minified
 * in production environments.
 *
 * This gulpfile calls require('require-dir')('gulp-tasks') which will look
 * in the gulp-tasks folder for any gulp "tasks" it can find and load them
 * so that they can be used in this file.
 *
 * If you find a task (see var allTasks below which is an array of tasks),
 * you should find a file with the same name inside of gulp-tasks/. This
 * file will have the task inside of it.
 *
 */

var gulp = require('gulp');
var fs = require('fs');
var runSequence = require('run-sequence');

// Get tasks from gulp-tasks directory
require('require-dir')('gulp-tasks');

var projectPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
GLOBAL.config = {
  env: 'prod',
  port: 8080,
  src: 'src',
  dest: 'dist',
  version: projectPackage.version,
  license: 'Apache',
  licenseOptions: {
    organization: 'Google Inc. All rights reserved.'
  }
};

var allTasks = ['styles', 'scripts', 'copy', 'html', 'images'];
gulp.task('default', function(cb) {
  runSequence(
    'clean',
    'bump',
    allTasks,
    'service-worker',
    cb);
});

function startWatchTasks() {
  return runSequence('clean', allTasks, 'service-worker', 'watch', 'nodemon');
}

gulp.task('dev', function() {
  GLOBAL.config.env = 'dev';
  GLOBAL.config.port = 8081;
  return startWatchTasks();
});

gulp.task('prod', startWatchTasks);
