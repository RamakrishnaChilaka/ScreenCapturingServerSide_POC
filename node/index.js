'use strict';

// setup default env variables
var path = require('path');
var express = require('express');
var expressWss = require('express-ws')(express());
var spawn = require("child_process").spawn;
var app = express()
var appWs = expressWss.app;
appWs.use('/uploads',express.static('./uploads'));

require('./video-processor')(appWs);

var port = Number(process.env.PORT || 7000);

appWs.listen(port, function () {
    console.log('Listening on port:' + port);
});

var httpPort = 7001;
app.listen(httpPort, function() {
    console.log('Listening on port: ' + httpPort);
});

app.get('/stop', (req, res) => {
    console.log("Executing python script")
    var process = spawn('python',["./python/upload.py"] ); // add arguments to the list.
    return res.send('Received a stop Recording request');
});

