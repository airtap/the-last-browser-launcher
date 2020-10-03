'use strict'

module.exports = [
  {
    name: 'chrome',
    channel: 'stable',

    // For darwin finder
    darwin: 'chrome',

    // Array of commands in a *nix environment
    commands: ['google-chrome', 'google-chrome-stable'],

    // To extract version from $(command --version)
    versionRegex: /Google Chrome (\S+)/i
  },
  {
    name: 'chrome',
    channel: 'beta',
    darwin: 'chrome-beta',
    commands: ['google-chrome-beta'],
    versionRegex: /Google Chrome (\S+)/i
  },
  {
    name: 'chrome',
    channel: 'dev',
    darwin: 'chrome-dev',
    commands: ['google-chrome-unstable'],
    versionRegex: /Google Chrome (\S+)/i
  },
  {
    name: 'chrome',
    channel: 'canary',
    darwin: 'chrome-canary',
    commands: ['google-chrome-canary'],
    versionRegex: /Google Chrome (\S+)/i
  },
  {
    name: 'chromium',
    channel: 'stable',
    darwin: 'chromium',
    commands: ['chromium', 'chromium-browser'],
    versionRegex: /Chromium (\S+)/i
  },
  {
    name: 'chromium',
    channel: 'dev',
    darwin: 'chromium-dev',
    commands: ['chromium-dev'],
    versionRegex: /Chromium (\S+)/i
  },
  {
    name: 'firefox',
    channel: 'release',
    darwin: 'firefox',
    commands: ['firefox'],
    versionRegex: /Mozilla Firefox (\S+)/i
  },
  {
    name: 'firefox',
    channel: 'developer',
    darwin: 'firefox-developer',
    commands: ['firefox-developer'],
    versionRegex: /Mozilla Firefox (\S+)/i
  },
  {
    name: 'firefox',
    channel: 'nightly',
    darwin: 'firefox-nightly',
    commands: ['firefox-nightly'],
    versionRegex: /Mozilla Firefox (\S+)/i
  },
  {
    name: 'safari',
    darwin: 'safari',
    commands: ['safari']
  },
  {
    name: 'ie',
    darwin: 'ie',
    commands: ['ie']
  },
  {
    name: 'msedge',
    channel: 'stable',
    darwin: 'msedge',
    commands: ['msedge'],
    versionRegex: /Microsoft Edge (\S+)/i
  },
  {
    name: 'msedge',
    channel: 'beta',
    darwin: 'msedge-beta',
    commands: ['msedge-beta'],
    versionRegex: /Microsoft Edge (\S+)/i
  },
  {
    name: 'msedge',
    channel: 'canary',
    darwin: 'msedge-canary',
    commands: ['msedge-canary'],
    versionRegex: /Microsoft Edge (\S+)/i
  },
  {
    name: 'brave',
    channel: 'release',
    darwin: 'brave',
    commands: ['brave-browser', 'brave'],
    versionRegex: /Brave Browser (\S+)/i
  },
  {
    name: 'brave',
    channel: 'beta',
    darwin: 'brave-beta',
    commands: ['brave-browser-beta', 'brave-beta'],
    versionRegex: /Brave Browser (\S+)/i
  },
  {
    name: 'brave',
    channel: 'dev',
    darwin: 'brave-dev',
    commands: ['brave-browser-dev', 'brave-dev'],
    versionRegex: /Brave Browser (\S+)/i
  },
  {
    name: 'brave',
    channel: 'nightly',
    darwin: 'brave-nightly',
    commands: ['brave-browser-nightly', 'brave-nightly'],
    versionRegex: /Brave Browser (\S+)/i
  },
  {
    name: 'opera',
    channel: 'stable',
    darwin: 'opera',
    commands: ['opera'],
    versionRegex: /Opera (\S+)/i
  }
]
