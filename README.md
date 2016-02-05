# Application Shell Architecture

A modern web application architecture leveraging [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) to offline cache your application 'shell' and populate the content using JS. This means you can get pixels on the screen without the network, even if the content eventually comes from the network - a great performance win. In browsers without SW, we gracefully degrade to server-side rendering (e.g iOS). [Demo](https://app-shell.appspot.com/).

Full details of the architecture can be found in [Instant Loading Web Apps With An Application Shell Architecture](https://medium.com/@addyosmani/instant-loading-web-apps-with-an-application-shell-architecture-7c0c2f10c73#.a4d09g3j4) and [Instant Loading with Service Workers](https://www.youtube.com/watch?v=jCKZDTtUA2A&feature=youtu.be).

## Goals

* Time to first paint is extremely fast
* Content is rendered. App shell can be a placeholder.
* User can scroll, but doesn’t necessarily need to be able to navigate or deeply interact.
* First pageload < 1000ms
 * App shell is progressively enhanced in.
 * User can now navigate within the app.
* Second pageload
 * Shell is loaded from SW cache
 * Content loads off the network

## Installation

Install dependencies using npm:

```sh
$ npm install -g gulp nodemon && npm install
```

## Usage

### Production Build

```sh
$ gulp
```

### Development Build with Watch

```sh
$ gulp dev
```

### Serve/watch

Once you've got a production build or development build of gulp done, start the
server with:

```sh
$ nodemon server/app.js
```

Alternatively, you can just run `npm run monitor`. The application shell should now be available on port `8080`.

### Deployment

We've deployed the project to Node.js on [Google Cloud](https://cloud.google.com/nodejs/). To do the same, follow the steps in their Node.js deployment [getting started](https://cloud.google.com/nodejs/getting-started/hello-world) guide and after running `npm install` run `gcloud preview app deploy app.yaml --promote`. If everything works correctly, you should have the project deployed to your custom AppSpot endpoint.

## Notes

## Tips for your application shell

In a [Progressive Web App](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/), everything necessary to load the the simplest "shell" of your UI consists of HTML, CSS and JavaScript. Keep this shell as lean as possible. Some of it will come from your application’s index file (inline DOM, styles) and the rest may be loaded from external scripts and stylesheets. Together, they are all you need to display a simple, static app. It’s important to keep the shell of your webapp lean to ensure that some inline static structural content can be displayed as soon as the webapp is opened, regardless of the network being available or not.

A static webapp that always displays the same content may not be what your users expect - it may well be quite dynamic. This means the app may need to fetch data specific to the user’s current needs so this data can come from the network / a server-side API but we logically separate this work for our app from the application shell. When it comes to offline support, structuring your app so that there's a clear distinction between the page shell and the dynamic or state-specific resources will come in very handy.

## Gotchas

There are no hard and fast rules with this architecture, but there are a few gotchas you should be aware of.

* Requests for application content may be delayed by various processes such loading of the app shell, loading of JavaScript or fetch requests. Jake Archibald hacked around this by initiating the data request in his Wikipedia offline web app as he [served the shell](https://github.com/jakearchibald/offline-wikipedia/blob/master/public/js/sw/index.js#L59).

* In the application shell architecture, downloading and adding content can interfere with progressive rendering. This can be an issue for larger JavaScript bundles or longer pieces of content on slow connections. It might even cause performance issues when reading content from the disk. Where possible *include* meaningful page content with the initial download rather than making a separate request for it. In the Wikipedia application, Jake was loading third party content and had to work around this, which is why he used the [Streams API](https://github.com/jakearchibald/offline-wikipedia/blob/master/public/js/page/views/article.js#L86). We strongly recommend reducing the number of requests made for your page content if at all possible.

## FAQs

* Why is there a noscript tag for CSS files?

    There is a great deal of content surrounding how to optimize for the
    [critical render path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=en).
    This boils down to, prioritize CSS for the visible viewport on first load
    by inlining those styles and then asynchronously load in additional styles.
    At the moment the web doesn't have any way to asynchronously load extra CSS
    files. The only way you can do it is to use JavaScript to add the CSS files
    after the page has loaded / started to render.

    The reason we have a `<noscript>` tag is that if a user has
    disabled JavaScript, those extra files, loaded by JavaScript, will never
    be loaded. Meaning, if you still want the extra styles to loaded when JS
    is disabled, you simply add a link to them inside the `<noscript>` tag.

    Because this project is aimed at progressively enhancing, this is a simple
    way to work without JS and then progressively enhance, adding in support
    for a faster load time by asynchronously loading extra styles.

* Why care about noscript in an architecture depending on fetch support?

    This architecture doesn't depend on JavaScript. *If* JavaScript is supported
    then we rely on a fetch library to handle network requests.

    Essentially the `noscript` use is a small (and trivial) attempt at treating
    JavaScript as a progressive enhancement.

## License

Copyright 2015 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Please note: this is not a Google product

## Acknowledgements

With thanks to Paul Lewis for his inspiration in the [Voice Memos](https://voice-memos.appspot.com/) app and [Yannick Lung](https://www.iconfinder.com/icons/315148/app_document_file_icon#size=512) for the App icon used.
