const test = require('tape');
const Browsers = require('../lib/browsers');

test('browser platforms without any variants', function (t) {
    var browsers = new Browsers({
        firefox: {}
    });

    t.deepEqual(browsers.browserPlatforms(), [{
        type: 'firefox',
        darwin: 'firefox',
        linux: ['firefox'],
        regex: undefined
    }]);
    t.end()
});

test('browser platforms with multiple variants', function (t) {
    var browsers = new Browsers({
        firefox: {
            variants: {
                'firefox': ['firefox'],
                'firefox-developer': ['firefox-developer']
            }
        }
    });

    t.deepEqual(browsers.browserPlatforms(), [{
        type: 'firefox',
        darwin: 'firefox',
        linux: ['firefox'],
        regex: undefined
    }, {
        type: 'firefox',
        darwin: 'firefox-developer',
        linux: ['firefox-developer'],
        regex: undefined
    }]);
    t.end()
});

test('browser platforms when command is different from variant name', function (t) {
    var browsers = new Browsers({
        chrome: {
            variants: {
                'chrome': ['google-chrome']
            }
        }
    });

    t.deepEqual(browsers.browserPlatforms(), [{
        type: 'chrome',
        darwin: 'chrome',
        linux: ['google-chrome'],
        regex: undefined
    }]);
    t.end()
});

test('browser platforms when multiple commands are possible for a variant', function (t) {
    var browsers = new Browsers({
        chrome: {
            variants: {
                'chrome': ['google-chrome', 'google-chrome-stable']
            }
        }
    });

    t.deepEqual(browsers.browserPlatforms(), [{
        type: 'chrome',
        darwin: 'chrome',
        linux: ['google-chrome', 'google-chrome-stable'],
        regex: undefined
    }]);
    t.end()
});

test('browser config by type', function (t) {
    var browsers = new Browsers({
        chrome: {
            profile: true
        },
        firefox: {
            profile: false
        }
    });

    t.deepEqual(browsers.typeConfig('firefox'), {
        profile: false
    });
    t.end()
});

test('browser config supports all options', function (t) {
    var browsers = new Browsers({
        chrome: {
            startupTime: 1000,
            beep: true,
            boop: '123'
        }
    });

    t.deepEqual(browsers.typeConfig('chrome'), {
        startupTime: 1000,
        beep: true,
        boop: '123'
    });
    t.end()
});
