'use strict'

const headless = require('headless-support')
const unix = require('./unix')
const darwin = require('./darwin')
const windows = require('./windows')
const variants = require('./variants')

module.exports = function (callback) {
  if (process.platform === 'win32') {
    return windows(function (err, manifests) {
      if (err) return callback(err)
      callback(null, manifests.map(augment))
    })
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

        manifests.push(augment(manifest))
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

function augment (manifest) {
  // Default to headless mode if supported
  const supports = { headless: headless(manifest.name, manifest.version) }
  const options = { headless: supports.headless }

  return { ...manifest, supports, options }
}
