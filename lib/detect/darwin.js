'use strict'

const fs = require('fs')
const path = require('path')
const plist = require('simple-plist')
const osxFindExecutable = require('@httptoolkit/osx-find-executable')

function finder (bundleId, versionKey) {
  return function find (callback) {
    osxFindExecutable(bundleId, function (err, execPath) {
      // Ignore not found error
      if (err) return callback()

      // The execPath is always "${bundlePath}/Contents/MacOS/${name}",
      // e.g. "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      const bundlePath = path.resolve(execPath, '..', '..', '..')
      const infoFile = path.join(bundlePath, 'Contents', 'Info.plist')

      plist.readFile(infoFile, function (err, info) {
        // Ignore parse or not found error
        if (err) return callback()

        callback(null, bundlePath, info[versionKey])
      })
    })
  }
}

exports.chrome = finder('com.google.Chrome', 'KSVersion')
exports['chrome-canary'] = finder('com.google.Chrome.canary', 'KSVersion')
exports.chromium = finder('org.chromium.Chromium', 'CFBundleShortVersionString')
exports.firefox = finder('org.mozilla.firefox', 'CFBundleShortVersionString')
exports['firefox-developer'] = finder('org.mozilla.firefoxdeveloperedition', 'CFBundleShortVersionString')
exports['firefox-nightly'] = finder('org.mozilla.nightly', 'CFBundleShortVersionString')
exports.safari = finder('com.apple.Safari', 'CFBundleShortVersionString')
exports.opera = finder('com.operasoftware.Opera', 'CFBundleVersion')
exports.msedge = finder('com.microsoft.edgemac', 'CFBundleVersion')
exports['msedge-beta'] = finder('com.microsoft.edgemac.Beta', 'CFBundleVersion')
exports['msedge-canary'] = finder('com.microsoft.edgemac.Canary', 'CFBundleVersion')
exports.brave = finder('com.brave.Browser', 'CFBundleVersion')
exports['brave-beta'] = finder('com.brave.Browser.beta', 'CFBundleVersion')
exports['brave-dev'] = finder('com.brave.Browser.dev', 'CFBundleVersion')
exports['brave-nightly'] = finder('com.brave.Browser.nightly', 'CFBundleVersion')
