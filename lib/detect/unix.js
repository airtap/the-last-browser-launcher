'use strict'

const which = require('which')
const cp = require('child_process')

module.exports = function find (commands, versionRegex, callback) {
  if (!commands.length) {
    return process.nextTick(callback)
  }

  let result
  let position = 0

  function next () {
    if (++position === commands.length) {
      if (!result) return callback()
      callback(null, result.command, result.version)
    }
  }

  for (const command of commands) {
    which(command, function (err, resolved) {
      if (err) return process.nextTick(next)

      getVersion(resolved, versionRegex, function (version) {
        // Prefer last result that has a version
        if (!result || version) result = { command: resolved, version }
        next()
      })
    })
  }
}

function getVersion (command, versionRegex, done) {
  cp.execFile(command, ['--version'], function (err, stdout) {
    if (err) return done()

    const match = versionRegex ? versionRegex.exec(stdout) : null
    const version = match ? match[1] : stdout.trim()

    done(/^\d/.test(version) ? version : null)
  })
}
