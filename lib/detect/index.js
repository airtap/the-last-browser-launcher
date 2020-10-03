'use strict'

const unix = require('./unix')
const darwin = require('./darwin')
const windows = require('./windows')
const variants = require('./variants')

module.exports = function (callback) {
  if (process.platform === 'win32') {
    return windows(callback)
  }

  let checked = 0
  let error

  const manifests = []

  for (const variant of variants) {
    const next = function (err, command, version) {
      if (err) {
        error = error || err
      } else if (command) {
        const manifest = { name: variant.name, command }

        // Optional properties
        if (version) manifest.version = version
        if (variant.channel) manifest.channel = variant.channel

        manifests.push(manifest)
      }

      if (++checked === variants.length) {
        callback(error, manifests)
      }
    }

    if (process.platform === 'darwin' && darwin[variant.darwin]) {
      darwin[variant.darwin](next)
    } else {
      unix(variant.commands, variant.versionRegex, next)
    }
  }
}
