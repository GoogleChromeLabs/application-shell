# Service Worker Application shell architecture

A sample web app shell demonstrating a shell + content architecture using [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/). This allows you to offline your 'shell', gaining performance advantages. More info coming soon.

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

## Philosophy

[Service Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) are fantastic for offline caching but they also offer significant  performance wins in the form of instant loading for repeat visits. This is possible with just a few changes to our overall application’s UI architecture.  

We can offline cache our application shell without the network being present and populate the content for it using JavaScript. This allows us to get meaningful pixels from our UI on the screen without the network, even if our content eventually comes from there. Think of it as displaying regions of the screen where toolbars and cards will eventually be populated very quickly and then loading in the rest of the content progressively.

### Tips for your application shell

In a [Progressive webapp](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/), everything necessary to load the the simplest "shell" of your UI consists of HTML, CSS and JavaScript. Keep this shell as lean as possible. Some of the will come from your application’s index file (inline DOM, styles) and the rest may be loaded from external scripts and stylesheets. Together, they are all you need to display a simple, static app. It’s important to keep the shell of your webapp learn to ensure that some inline static structural content can be displayed as soon as the webapp is opened, regardless of the network being available or not. 

A static webapp that always displays the same content may not be what your users expect - it may well be quite dynamic. This means the app may need to fetch data specific to the user’s current needs so this data can come from the network / a server-side API but we logically separate this work for our app from the application shell. When it comes to offline support, structuring your app so that there’s a clear distinction between the page shell and the dynamic or state-specific resources will come in very handy. 

## License

Copyright 2015 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Please note: this is not a Google product

## Acknowledgements

With thanks to Paul Lewis for his inspiration in the [Voice Memos](https://voice-memos.appspot.com/) app and [Yannick Lung](https://www.iconfinder.com/icons/315148/app_document_file_icon#size=512) for the App icon used.
