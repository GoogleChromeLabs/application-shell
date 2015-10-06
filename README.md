# Application shell

A sample web app shell demonstrating a shell + content architecture using [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/). This allows you to offline your 'shell', gaining performance advantages.

## Goals

* Time to first paint is extremely fast
* Content is rendered. App shell can be a placeholder.
* User can scroll, but doesn’t necessarily need to be able to navigate or deeply interact.
* First pageload > 1000ms
 * App shell is progressively enhanced in.
 * User can now navigate within the app.
* Second pageload
 * Shell is loaded from SW cache
 * Content loads off the network

## Installation

Install dependencies using npm:

```sh
$ npm install
```

## Usage

### Build

```sh
$ gulp
```

### Serve/watch

```sh
$ gulp dev
```

You will need to use AppEngine to serve the contents of the directory.

## License

Copyright 2015 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Please note: this is not a Google product
