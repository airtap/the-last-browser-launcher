'use strict'

const debug = require('debug')('airtap-system:launcher')
const EventEmitter = require('events').EventEmitter
const child = require('child_process')
const util = require('util')

const kManifest = Symbol('kManifest')
const kDarwinApp = Symbol('kDarwinApp')
const kWindowsImage = Symbol('kWindowsImage')

/**
 * Web browser instance
 * @param {Object}  options Configuration options
 * @param {Array}   options.args        Array list of command line arguments
 * @param {String}  options.command     Command used to start an instance's process
 * @param {String}  options.cwd         Instance's current working directory
 * @param {Boolean} options.detached    Flag telling if the instance should be started in detached mode
 * @param {Object}  options.env         Instance's environment variables
 * @param {String}  options.image       Instance image (used to kill it on Windows)
 * @param {String}  options.darwinApp   Instance process name (used to kill it on OSX)
 */
function Instance (manifest, options) {
  EventEmitter.call(this)

  this[kManifest] = manifest
  this[kDarwinApp] = options.darwinApp
  this[kWindowsImage] = options.image

  debug('spawn %o %o', options.command, options.args)

  this.process = child.spawn(options.command, options.args, {
    detached: options.detached,
    env: options.env,
    cwd: options.cwd
  })

  this.pid = this.process.pid
  this.stdout = this.process.stdout
  this.stderr = this.process.stderr

  // on Windows Opera uses a launcher which is stopped immediately after opening the browser
  // so it makes no sense to bind a listener, though we won't be noticed about crashes...
  if (this[kManifest].name === 'opera' && process.platform === 'win32') {
    return
  }

  // trigger "stop" event when the process exits
  this.process.on('close', this.emit.bind(this, 'stop'))
}

util.inherits(Instance, EventEmitter)

/**
 * Stop the instance
 * @param {Function} callback Callback function called when the instance is stopped
 */
Instance.prototype.stop = function (callback) {
  if (typeof callback === 'function') {
    this.once('stop', callback)
  }

  if (process.platform === 'win32' && this[kWindowsImage]) {
    // Opera case - it uses a launcher so we have to kill it somehow without a reference to the process
    child.exec('taskkill /F /IM ' + this[kWindowsImage])
      .on('close', this.emit.bind(this, 'stop'))
  } else if (process.platform === 'win32' && this[kManifest].name === 'ie') {
    // ie case on windows machine
    child.exec('taskkill /F /IM iexplore.exe')
      .on('close', this.emit.bind(this, 'stop'))
  } else if (process.platform === 'darwin' && this[kDarwinApp]) {
    // OSX case with "open" command
    child.exec('osascript -e \'tell application "' + this[kDarwinApp] + '" to quit\'')
  } else {
    // every other scenario
    this.process.kill()
  }
}

Instance.prototype.unref = function () {
  this.process.unref()
  this.process.stdin.unref()
  this.process.stdout.unref()
  this.process.stderr.unref()
}

module.exports = Instance
