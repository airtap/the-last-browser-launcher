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

launcher(function(err, browsers, launch) {
  if (err) {
    return console.error(err)
  }

  launch('http://example.com/', 'chrome', function(err, instance) {
    if (err) {
      return console.error(err)
    }

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

### Browser launch with options

```js
launch(
  'http://example.com/',
  {
    browser: 'chrome',
    noProxy: [ '127.0.0.1', 'localhost' ],
    options: [
      '--disable-web-security',
      '--disable-extensions'
    ]
  },
  function(err, instance) {
    // ...
  }
)
```

### Detaching the launched browser process from your script

If you want the opened browser to remain open after killing your script, first, you need to set `options.detached` to `true` (see the API). By default, killing your script will kill the opened browsers.

Then, if you want your script to immediately return control to the shell, you may additionally call `unref` on the `instance` object in the callback:

```js
launch('http://example.org/', {
  browser: 'chrome',
  detached: true
}, function(err, instance) {
  if (err) {
    return console.error(err)
  }

  instance.process.unref()
  instance.process.stdin.unref()
  instance.process.stdout.unref()
  instance.process.stderr.unref()
})
```

## API

``` js
const launcher = require('the-last-browser-launcher')
```

### `launcher([configPath], callback)`

Detect available browsers and pass `launch` function to the callback.

**Parameters:**

- *String* `configPath` - path to a browser configuration file *(Optional)*
- *Function* `callback(err, launch)` - function called with `launch` function and errors (if any)

### `launch(uri, options, callback)`

Open given URI in a browser and return an instance of it.

**Parameters:**

- *String* `uri` - URI to open in a newly started browser
- *Object|String* `options` - configuration options or name of a browser to launch
- *String* `options.browser` - name of a browser to launch
- *String* `options.version` - version of a browser to launch, if none was given, the highest available version will be launched
- *String* `options.proxy` - URI of the proxy server
- *Array* `options.options` - additional command line options
- *Boolean* `options.skipDefaults` - don't supply any default options to browser
- *Boolean* `options.detached` - if true, then killing your script will not kill the opened browser
- *Array|String* `options.noProxy` - An array of strings, containing proxy routes to skip over
- *Boolean* `options.headless` - run a browser in a headless mode (only if **Xvfb** available)
- *String* `options.profile` - path to a directory to use for the browser profile, overriding the default
- *Function* `callback(err, instance)` - function fired when started a browser `instance` or an error occurred

### `instance`

Browser instance object.

**Properties:**
- *String* `command` - command used to start the instance
- *Array* `args` - array of command line arguments used while starting the instance
- *String* `image` - instance's image name
- *String* `processName` - instance's process name
- *Object* `process` - reference to instance's process started with Node's `child_process.spawn` API
- *Number* `pid` - instance's process PID
- *Stream* `stdout` - instance's process STDOUT stream
- *Stream* `stderr` - instance's process STDERR stream

**Events:**
- `stop` - fired when instance stops

**Methods:**
- `stop(callback)` - stop the instance and fire the callback once stopped

## Known Issues

- IE8: after several starts and stops, if you manually open IE it will come up with a pop-up asking if we want to restore tabs (#21)
- Chrome @ OSX: it's not possible to launch multiple instances of Chrome at once

## License

MIT
