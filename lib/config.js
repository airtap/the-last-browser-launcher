'use strict'

const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const osenv = require('osenv')
const defaultConfigFile = osenv.home() + '/.config/' + pkg.name + '/config.json'

exports.defaultConfigFile = defaultConfigFile

/**
 * Read a configuration file
 * @param {String}   [configFile] Path to the configuration file
 * @param {Function} callback     Callback function
 */
exports.read = function read (configFile, callback) {
  if (typeof configFile === 'function') {
    callback = configFile
    configFile = defaultConfigFile
  }

  if (!configFile) {
    configFile = defaultConfigFile
  }

  const configDir = path.dirname(configFile)

  mkdirp(configDir, function (err) {
    if (err) return callback(err)

    fs.readFile(configFile, function (err, src) {
      if (err && err.code === 'ENOENT') {
        return callback(null, null, configDir)
      } else if (err) {
        return callback(err)
      }

      let data
      try {
        data = JSON.parse(src)
      } catch (e) {
        return callback(e)
      }

      callback(null, data, configDir)
    })
  })
}

/**
 * Write a configuration file
 * @param {String}   configFile Path to the configuration file
 * @param {Object}   config     Configuration object
 * @param {Function} callback   Callback function
 */
exports.write = function (configFile, config, callback) {
  callback = callback || function () {
  }

  if (typeof configFile === 'object') {
    callback = config
    config = configFile
    configFile = defaultConfigFile
  }

  mkdirp(path.dirname(configFile), function (err) {
    if (err) {
      return callback(err)
    }

    fs.writeFile(configFile, JSON.stringify(config, null, 2), callback)
  })
}
