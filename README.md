# the-last-browser-launcher

**Detect the browsers installed on your system and launch them in an isolated profile for automation & testing purposes. Supports Linux, Mac and Windows.**

[![npm status](http://img.shields.io/npm/v/the-last-browser-launcher.svg)](https://www.npmjs.org/package/the-last-browser-launcher)
[![node](https://img.shields.io/node/v/the-last-browser-launcher.svg)](https://www.npmjs.org/package/the-last-browser-launcher)
[![Travis build status](https://img.shields.io/travis/com/airtap/the-last-browser-launcher.svg?label=travis)](http://travis-ci.com/airtap/the-last-browser-launcher)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This project is the latest in a long series, each forked from the last:

- [`substack/browser-launcher`](https://github.com/substack/browser-launcher) (lightly maintained)
- [`benderjs/browser-launcher2`](https://github.com/benderjs/browser-launcher2) (unmaintained).
- [`james-proxy/james-browser-launcher`](https://github.com/james-proxy/james-browser-launcher) (unmaintained)
- [`httptoolkit/browser-launcher`](https://github.com/httptoolkit/browser-launcher) (actively maintained)

They all have their problems. This fork is temporary, meant to consolidate fixes and reduce API surface, after which it will be split up into small, community-owned modules. In other words, this fork exists so that the project can die a good death. Its API is subject to change without warning.

## Supported browsers

- Chrome
- Chromium
- Firefox
- IE (Windows only)
- Chromium-based Edge (Windows & Mac only)
- Brave (Experimental)
- Opera
- Safari

## Install

```
npm install the-last-browser-launcher
```

## Example

### Browser launch

```js
const launcher = require('the-last-browser-launcher')

launcher.detect(function(err, manifests) {
  if (err) throw err

  launcher.launch(manifests[0], 'http://example.com/', function(err, instance) {
    if (err) throw err

    console.log('Instance started with PID:', instance.pid)

    instance.on('stop', function(code) {
      console.log('Instance stopped with exit code:', code)
    })
  })
})
```

Outputs:

```
$ node example/launch.js
Instance started with PID: 12345
Instance stopped with exit code: 0
```

## API

``` js
const launcher = require('the-last-browser-launcher')
```

### `launcher.detect(callback)`

Get available browsers.

**Parameters:**

- *Function* `callback(err, manifests)`

### `launcher.launch(manifest, uri[, options], callback)`

Open given URI in a browser and yield an `instance` of it.

**Parameters:**

- *Object* `manifest` - A manifest from `detect()`
- *String* `uri` - URI to open in a newly started browser
- *Object* `options`:
  - *String* `proxy` - URI of the proxy server
  - *Array* `args` - additional command line arguments
  - *Boolean* `skipDefaults` - don't supply any default args to browser
  - *Boolean* `detached` - if true, then killing your script will not kill the opened browser
  - *Array|String* `noProxy` - An array of strings, containing proxy routes to skip over
  - *Boolean* `headless` - run a browser in a headless mode (only if **Xvfb** available)
- *Function* `callback(err, instance)`

### `instance`

Browser instance object.

**Properties:**
- *Object* `process` - reference to instance's process started with Node's `child_process.spawn` API
- *Number* `pid` - instance's process PID
- *Stream* `stdout` - instance's process STDOUT stream
- *Stream* `stderr` - instance's process STDERR stream

**Events:**
- `stop` - fired when instance stops

**Methods:**
- `unref()`
- `stop(callback)` - stop the instance and fire the callback once stopped

## Known Issues

- IE8: after several starts and stops, if you manually open IE it will come up with a pop-up asking if we want to restore tabs (#21)
- Chrome @ OSX: it's not possible to launch multiple instances of Chrome at once

## License

MIT
