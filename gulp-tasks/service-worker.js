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
var fs = require('fs');
var swPrecache = require('sw-precache');

// This is used as the cacheID, worth only reading the file once.
var packageName = JSON.parse(fs.readFileSync('./package.json', 'utf8')).name;

gulp.task('service-worker:watch', function(cb) {
  gulp.watch(GLOBAL.config.dest + '/**/*.*', ['service-worker']);
  gulp.watch(GLOBAL.config.src + '/../server/views/**/*.*',
    ['service-worker']);
});

gulp.task('service-worker', function(cb) {
  swPrecache.write(path.join(GLOBAL.config.dest, 'sw.js'), {
    staticFileGlobs: [
      GLOBAL.config.dest + '/**/*.{js,html,css,png,jpg,jpeg,gif,svg}',
      GLOBAL.config.dest + '/manifest.json'
    ],
    dynamicUrlToDependencies: {
      '/app-shell': ['server/views/layouts/app-shell.handlebars'],
      '/api/': [
        'server/views/index.handlebars',
        GLOBAL.config.dest + '/styles/core.css'
      ],
      '/api/url-1': [
        'server/views/url-1.handlebars'
      ],
      '/api/url-2': [
        'server/views/url-2.handlebars'
      ]
    },
    stripPrefix: GLOBAL.config.dest,
    navigateFallback: '/app-shell',
    cacheId: packageName,
    handleFetch: (GLOBAL.config.env === 'prod')
  })
  .then(cb)
  .catch(() => {
    cb();
  });
});
