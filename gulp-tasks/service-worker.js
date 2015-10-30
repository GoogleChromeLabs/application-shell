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
var path = require('path');
var swPrecache = require('sw-precache');

gulp.task('service-worker:watch', function(cb) {
  gulp.watch(GLOBAL.config.src + '/**/*.*', ['service-worker']);
});

gulp.task('service-worker', function(cb) {
  swPrecache.write(path.join(GLOBAL.config.dest, 'sw.js'), {
    staticFileGlobs: [
      GLOBAL.config.dest + '/**/*.{js,html,css,png,jpg,jpeg,gif,svg}',
      GLOBAL.config.dest + '/manifest.json',
    ],
    dynamicUrlToDependencies: {
      '/app-shell': ['server/layouts/app-shell.handlebars'],
      '/partials/': ['server/layouts/partial.handlebars', 'server/views/index.handlebars'],
      '/partials/url-1': ['server/layouts/partial.handlebars', 'server/views/url-1.handlebars'],
      '/partials/url-2': ['server/layouts/partial.handlebars', 'server/views/url-2.handlebars'],
    },
    stripPrefix: GLOBAL.config.dest,
    navigateFallback: '/app-shell'
  }, cb);
});
