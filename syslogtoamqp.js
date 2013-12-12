var config = require('config')
    , fs = require('fs')
    , async = require('async')
    , connector = require('./lib/' + config.server.connector)
    , dgram = require('dgram')
    , server;

///////////////////////////////
//
// Starting server, proxy and sockets
//
////////////////////////////////
async.series([
    function(callback){
        server = dgram.createSocket(config.server.options.type);

        server.on('listening', function() {
            console.log('Datagram socket server started on: ' + server.address().address);
            process.nextTick(function() {callback(null); });
        });

        if (config.server.port && config.server.host) {
            server.bind(config.server.port, config.server.host);
        } else {
            throw 'You have to set host & port';
        }

    }], function(err, results){
        if (!err) {
            async.waterfall([
                function(callback){
                    connector.connect(config, function(err, connectionHandler) {
                        if (err) {
                            process.nextTick(function() {throw 'error within amqp connection happend ' + err});
                        } else {
                            console.log('Connected to connector.');
                            process.nextTick(function() {callback(null, connectionHandler); });
                        }
                    });
                },
                function(connectionHandler, callback){
                    var message = "";
                    server.on('message', function(msg, senderinfo) {
                        var messageToSend = msg.toString();
                        try{
                            connector.send(connectionHandler, msg, config, function(err) {
                                if (!err) {
                                    process.nextTick(function() {callback(null); });
                                } else {
                                    process.nextTick(function() {callback(err); });
                                }
                            });
                        } catch(e) {
                            // try to write data to the filesystem
                            fs.appendFile(config.fs.failoverfile + (+new Date()).toString(), messageToSend, function (err) {
                                if (err) {
                                    throw 'Could not write into file after not beeing able to write to an exchange.';
                                } else {
                                    process.nextTick(function() {callback('Publishing error: ' + e); });
                                }
                            });
                        }
                    });
                }], function (err, results) {
                    if (err) {
                        console.error("Error of async.waterfall in end function after start series: " + err);
                    }
                })
        } else {
            if (err) {
                console.error("Error in async.series: " + err);
            }
        }
    });