'use strict'

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
  const { name, version } = manifest

  // Detect headless support by platform and version
  let headless = false

  const major = parseInt(version, 10)
  const darwin = process.platform === 'darwin'
  const win32 = process.platform === 'win32'
  const unix = !darwin && !win32

  if (name === 'chromium' || name === 'chrome' || name === 'msedge') {
    headless = !version || (unix && major >= 59) || (darwin && major >= 59) || (win32 && major >= 60)
  } else if (name === 'opera') {
    // TBD. Currently shows a white window with --headless
  } else if (name === 'firefox') {
    headless = !version || (unix && major >= 55) || (darwin && major >= 56) || (win32 && major >= 56)
  }

  // Default to headless if supported
  const supports = { headless }
  const options = { headless }

  return { ...manifest, supports, options }
}
