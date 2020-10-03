'use strict'

const headless = require('headless')
const tempy = require('tempy')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('airtap-system:launcher')
const Instance = require('./instance')
const setups = {}

setups.firefox = function (manifest, profile, options, callback) {
  const prefs = options.skipDefaults ? {} : {
    'browser.shell.checkDefaultBrowser': false,
    'browser.bookmarks.restore_default_bookmarks': false,
    'dom.disable_open_during_load': false,
    'dom.max_script_run_time': 0,
    'browser.cache.disk.capacity': 0,
    'browser.cache.disk.smart_size.enabled': false,
    'browser.cache.disk.smart_size.first_run': false,
    'browser.sessionstore.resume_from_crash': false,
    'browser.startup.page': 0,

    // Disable updates (none of these seem to work anymore)
    'app.update.enabled': false,
    'app.update.checkInstallTime': false,
    'app.update.auto': false
  }

  if (options.proxy) {
    const match = /^(?:http:\/\/)?([^:/]+)(?::(\d+))?/.exec(options.proxy)

    prefs['network.proxy.http'] = match[1]
    prefs['network.proxy.http_port'] = parseInt(match[2] || 80, 10)
    prefs['network.proxy.type'] = 1
    prefs['network.proxy.no_proxies_on'] = joinHosts(options.noProxy, ',')
  }

  if (options.prefs) {
    Object.assign(prefs, options.prefs)
  }

  const js = JSON.stringify
  const lines = Object.keys(prefs).map(k => `user_pref(${js(k)}, ${js(prefs[k])});`)
  const fp = path.join(profile, 'user.js')

  fs.writeFile(fp, lines.join('\n'), function (err) {
    if (err) return callback(err)

    const args = ['--no-remote', '-profile', profile]
    const defaults = []

    // TODO: use this instead of xvfb, only on FF 55+ on Linux, 56+ on Windows & Mac
    // args.push('-headless')

    callback(null, args, defaults)
  })
}

setups.chromium = function (manifest, profile, options, callback) {
  const args = ['--user-data-dir=' + nospace(profile)]
  const noProxy = joinHosts(options.noProxy, ';')

  if (options.proxy) args.push('--proxy-server=' + nospace(options.proxy))
  if (noProxy) args.push('--proxy-bypass-list=' + nospace(noProxy))

  const defaults = [
    '--disable-restore-session-state',
    '--no-default-browser-check',
    '--disable-popup-blocking',
    '--disable-translate',
    '--start-maximized',
    '--disable-default-apps',
    '--disable-sync',
    '--enable-fixed-layout',
    '--no-first-run',
    '--noerrdialogs'
  ]

  process.nextTick(callback, null, args, defaults)
}

setups.chrome = function (manifest, profile, options, callback) {
  setups.chromium(manifest, profile, options, function (err, args, defaults) {
    if (err) return callback(err)

    // TODO: use this instead of xvfb, only on chrome 59+ on Mac & Linux, 60+ on Windows
    // TODO: requires --disable-gpu on Windows (https://bugs.chromium.org/p/chromium/issues/detail?id=737678)
    // args.push('--headless', '--disable-gpu')

    callback(null, args, defaults)
  })
}

setups.opera = function (manifest, profile, options, callback) {
  const src = path.resolve(__dirname, 'opera-prefs.json')
  const dest = path.join(profile, 'Preferences')

  fs.copyFile(src, dest, function (err) {
    if (err) return callback(err)

    // Everything else is the same as chromium
    setups.chromium(manifest, profile, options, callback)
  })
}

setups.ie = function (manifest, profile, options, callback) {
  const args = []
  const defaults = []

  if (manifest.version && parseInt(manifest.version, 10) >= 8) {
    // Achieve some form of session isolation
    args.push('-private', '-nosessionmerging')
  }

  process.nextTick(callback, null, args, defaults)
}

setups.safari = function (manifest, profile, options, callback) {
  process.nextTick(callback, null, [], [])
}

// These are chromium-based
setups.msedge = setups.chromium
setups.brave = setups.chromium

// These have no profile directory
setups.ie.profile = false
setups.safari.profile = false

module.exports = function (manifest, uri, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  // Shallow clone the options, as we may mutate it below
  options = { ...manifest.options, ...options }

  // Start xvfb for headless mode, unless xvfb is already running
  // as determined by presence of env.DISPLAY
  if (options.headless && !process.env.DISPLAY) {
    headless(function (err, proc, display) {
      if (err) return callback(err)

      // TODO: stop xvfb on browser stop
      run({ ...process.env, DISPLAY: ':' + display })
    })
  } else {
    run({ ...process.env })
  }

  function run (env) {
    const setup = setups[manifest.name]
    const profile = setup.profile === false ? null : tempy.directory()

    debug('manifest: %O', manifest)
    setup(manifest, profile, options, function (err, args, defaults) {
      if (err) return callback(err)

      if (options.args) args = options.args.concat(args)
      if (!options.skipDefaults) args = args.concat(defaults)

      // Set proxy configuration in environment
      const noProxy = joinHosts(options.noProxy, ',')

      if (noProxy && !env.no_proxy) env.no_proxy = noProxy
      if (options.proxy && !env.http_proxy) env.http_proxy = options.proxy
      if (options.proxy && !env.HTTP_PROXY) env.HTTP_PROXY = options.proxy

      let command = manifest.command
      let darwinApp

      if (process.platform === 'darwin' && command.endsWith('.app')) {
        // open --wait-apps --new --fresh -a /Path/To/App <url> --args <rest>
        args.unshift('--wait-apps', '--new', '--fresh', '-a', command, uri, '--args')
        darwinApp = command
        command = 'open'
      } else {
        args.push(uri)
      }

      try {
        var instance = new Instance(manifest, {
          command,
          darwinApp,
          image: options.image,
          args: args.filter(Boolean),
          detached: !!options.detached,
          env
        })
      } catch (err) {
        return callback(err)
      }

      callback(null, instance)
    })
  }
}

function joinHosts (hosts, sep) {
  if (!hosts) {
    return ''
  } else if (typeof hosts === 'string') {
    return hosts.split(/[,;]+/).filter(Boolean).join(sep)
  } else {
    return hosts.filter(Boolean).join(sep)
  }
}

function nospace (arg) {
  if (arg.includes(' ')) {
    const json = JSON.stringify(arg)
    throw new Error(`Argument cannot contain spaces: ${json}`)
  }

  return arg
}
