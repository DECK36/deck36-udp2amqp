/**
 * Declares the amqpconnector class.
 *
 * @author     Mike Lohmann <mike.lohmann@deck36.de>
 * @copyright  Copyright (c) 2013 DECK36 GmbH & Co. KG (http://www.deck36.de)
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
var amqp = require('amqp');

/**
 *
 * Connect to a amqp exchange and send data to it.
 *
 * config has to be like:
 *
 * config = {
 *  connectors: {
 *      amqp: {
 *          exchanges: {
 *              rsyslog: {
 *                  routingKey: 'Key',
 *                  name: 'exchangeName',
 *                  options: {
 *                      durable: true,
 *                      ...
 *                  }
 *              }
 *          }
 *      }
 *   }
 * }
 *
 *
 * @param {amqp} amqp
 *
 * @constructor
 */
function AmqpConnector(amqp) {

    /**
     * @type {amqp}
     */
    this.amqp = amqp;

    /**
     *
     * @param exchange
     * @param message
     * @param config
     * @param callback
     */
    this.send = function(exchange, message, config, callback) {
        exchange.publish(
            config.connectors.amqp.exchanges.rsyslog.routingKey,
            message.toString(),
            config.connectors.amqp.exchanges.rsyslog.publishoptions,
            function () {
            // Called in confirmation mode, only
            // maybe it is what we need for logging?!
            console.log('data has been published.');
            }
        );
        callback(null);
    };

    this.connect = function(config, callback) {
        var amqpconnection = this.amqp.createConnection(config.connectors.amqp);
        amqpconnection.on('error', function (e)
        {
            amqpconnection.end("closing amqp connection");
            throw 'error within amqp connection happend ' + e;
        });

        amqpconnection.on('ready', function (err)
        {
            if (!err) {
                amqpconnection.exchange(
                    config.connectors.amqp.exchanges.rsyslog.name,
                    config.connectors.amqp.exchanges.rsyslog.options,
                    function (exchange)
                    {
                        callback(null, exchange);
                    }
                );
            } else {
                callback('error in amqpconnection on ready: ' + err);
            }
        });
    }
}

module.exports = new AmqpConnector(amqp);