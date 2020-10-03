'use strict'

const winDetect = require('win-detect-browsers')

module.exports = function (callback) {
  winDetect(function (err, found) {
    if (err) return callback(err)

    const manifests = found.map(function ({ name, path, version, channel, arch }) {
      const manifest = { name, command: path }

      // Optional properties
      if (version) manifest.version = version
      if (channel) manifest.channel = channel
      if (arch) manifest.arch = arch

      return manifest
    })

    callback(null, manifests)
  })
}
