/**
 * Declares the rsyslogtoamqp-test class.
 *
 * @author     Mike Lohmann <mike.lohmann@deck36.de>
 * @copyright  Copyright (c) 2013 DECK36 GmbH & Co. KG (http://www.deck36.de)
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
var dgram = require('dgram')
    , config = require('config')
    , fs = require('fs')
    , assert = require('assert');

describe('Testing to send data to the server and receiving the results.', function() {
    var filePath = config.connectors.file.filename;

    describe('Sending JSON string', function() {
        it('should be available in a tesfile written by a connector', function(done) {
            var testData = '{"test":1}';
            var message = new Buffer(testData);
            var client = dgram.createSocket(config.server.options.type);

            client.send(
                message,
                0,
                message.length,
                config.server.port,
                config.server.host,
                function(err, bytes) {
                    assert.equal(null, err);
                    assert.equal(bytes, message.length);

                    fs.readFile(filePath, function (err, data) {
                        if (!err) {
                            assert.equal(null, err);
                            assert.equal(message.toString(), data.toString());
                        } else {
                            throw err;
                        }
                        done();
                    });
                }
            );
        });
    });
});