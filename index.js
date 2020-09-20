'use strict'

const tempy = require('tempy')
const detect = require('./lib/detect')
const run = require('./lib/run')

module.exports = function getLauncher (callback) {
  detect(function (browsers) {
    for (const browser of browsers) {
      if (browser.profile) {
        // TODO: move to runner
        browser.profile = tempy.directory()
      }
    }

    function launch (uri, options, callback) {
      if (typeof options === 'string') {
        options = {
          browser: options
        }
      }

      options = options || {}

      const version = options.version || options.browser.split('/')[1] || '*'
      const name = options.browser.toLowerCase().split('/')[0]
      const runner = run(browsers, name, version)

      if (!runner) {
        return process.nextTick(callback, new Error(name + ' is not installed in your system.'))
      }

      runner(uri, options, callback)
    }

    callback(null, browsers, launch)
  })
}
