/**
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

const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const sequence = require('run-sequence');
const source = require('vinyl-source-stream');
const spawn = require('child_process').spawn;
const uglify = require('gulp-uglify');
const workboxBuild = require('workbox-build');

const SRC_DIR = 'src';
const BUILD_DIR = 'build';
const THIRD_PARTY_MODULES = [
  'immutable',
  'isomorphic-fetch',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'redux',
  'redux-actions',
  'redux-promise'
];

gulp.task('clean', () => {
  return del(BUILD_DIR);
});

gulp.task('bundle-app', () => {
  let bundler = browserify({
    entries: path.join(SRC_DIR, 'components', 'client.jsx'),
    extensions: ['.jsx'],
    transform: [babelify]
  });

  THIRD_PARTY_MODULES.forEach(module => bundler.external(module));

  return bundler.bundle()
    .on('error', function(error) {
      gutil.log('Babelify error:', error.message);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(`${BUILD_DIR}/js`));
});

gulp.task('bundle-third-party', () => {
  let bundler = browserify();
  THIRD_PARTY_MODULES.forEach(module => bundler.require(module));

  return bundler.bundle()
    .on('error', function(error) {
      gutil.log('Babelify error:', error.message);
      this.emit('end');
    })
    .pipe(source('third-party.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest(`${BUILD_DIR}/js`));
});

gulp.task('copy-static', () => {
  return gulp.src(`${SRC_DIR}/static/**/*`)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('sass', () => {
  return gulp.src(`${SRC_DIR}/static/sass/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${BUILD_DIR}/styles`));
});

gulp.task('uglify-js', () => {
  return gulp.src(`${BUILD_DIR}/js/**/*`)
    .pipe(uglify())
    .pipe(gulp.dest(`${BUILD_DIR}/js`));
});

gulp.task('version-assets', () => {
  return gulp.src(`${BUILD_DIR}/*/*`)
    .pipe(rev())
    .pipe(gulp.dest(`${BUILD_DIR}/rev`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('service-worker', () => {
  return workboxBuild.injectManifest({
    swSrc: `${SRC_DIR}/static/service-worker.js`,
    swDest: `${BUILD_DIR}/service-worker.js`,
    globDirectory: BUILD_DIR,
    staticFileGlobs: [
      'rev/js/**/*.js',
      'rev/styles/all*.css',
      'images/**/*'
    ],
    templatedUrls: {
      '/app-shell': [
        'rev/js/**/*.js',
        'rev/styles/all*.css',
        '../src/views/index.handlebars'
      ]
    }
  });
});

gulp.task('build:dev', ['clean'], callback => {
  process.env.NODE_ENV = 'development';
  sequence(
    ['bundle-app', 'bundle-third-party', 'copy-static', 'sass'],
    'version-assets',
    'service-worker',
    callback
  );
});

gulp.task('build:dist', ['clean'], callback => {
  process.env.NODE_ENV = 'production';
  sequence(
    ['bundle-app', 'bundle-third-party', 'copy-static', 'sass', 'lint'],
    'uglify-js',
    'version-assets',
    'service-worker',
    callback
  );
});

gulp.task('serve', callback => {
  spawn('node', ['index.js'], {stdio: 'inherit'})
    .on('error', error => callback(error))
    .on('exit', error => callback(error));
});

gulp.task('lint', () => {
  // Temporarily disable linting...
  // return gulp.src([`${SRC_DIR}/**/*.{js,jsx}`, '*.js'])
  //   .pipe(eslint())
  //   .pipe(eslint.format())
  //   .pipe(eslint.failOnError());
});

gulp.task('default', callback => {
  sequence('build:dev', 'serve', callback);
});

process.on('SIGINT', process.exit);
