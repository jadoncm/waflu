var config = require('./config.js'),
    http   = require('./http')(config),
    socket = require('./socket')(config);