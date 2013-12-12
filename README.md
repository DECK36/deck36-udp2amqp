deck36-udp2amqp
==========================

[1]: https://github.com/DECK36/deck36-udp2amqp                          "deck36-udp2amqp"
[2]: https://github.com/joyent/node                                     "NodeJS"
[3]: https://npmjs.org/                                                 "npm"
[4]: https://github.com/gruntjs/grunt-cli                               "grunt-cli"
[5]: http://www.aboutdebian.com/syslog.htm                              "rsyslog"
[6]: http://devo.ps/blog/2013/06/26/goodbye-node-forever-hello-pm2.html "pm2"
[7]: http://www.cyberciti.biz/faq/linux-unix-tcp-port-forwarding/       "socat"

![DECK36](http://www.deck36.de/assets/deck36-logo-medium-white-doc.jpg)

## Introduction

The [deck36-udp2amqp][1] is a server which can take messages from a syslog daemon and push them into an amqp
based exchange as served by rabbitmq.

##Goals

We needed a tool to receiving syslog messages an transport them into an exchange (RabbitMQ).
The tool should be scaleable (1000+ msg/s) and easy to install / operate.
Syslog should be able to send data to the tool.

### Background

We use this to get rid of a slow (connection and handshake takes about 50ms per request) PHP (monolog handler)
implementation for logging data from our application. By just using the syslog handler from monolog we save about 50ms
per request and have a decoupled log receiver.

Beside that you can just log everything you get into syslog to amqp (e.g. Access/Error logs).

We also tried a rsylog plugin which should provide such functionality, but it seems not to work with the wheezy
standard installation.

## Non-Goals

Currently for us the UDP variant is good enough, because each app server gets its own installation of deck36-udp4amqp.
If, for example all webservers should log into one central log-backend, it is possible, but perhaps you won't use UDP.

Nevertheless, this tool, can be extended by providing TCP sockets, too.

## Installation

1. Make sure you have [nodejs][2] installed.
2. Ensure [npm][3] is installed, too.
3. Checkout these sources.
4. execute npm install
5. sudo npm -i -g [grunt-cli][4]
6. sudo npm -i -g [pm2][6]

or

`./bin/install.sh`

## Development

Install dev dependencies with `npm -i install --dev`.

or

`./bin/install_dev.sh`

1. Run grunt start-server-dev
With this command you will start a file watching process which executes mocha unittests as soon as some file has been
changed.

2. Configure the rsylog daemon to push messages into the provided udp socket.
You can use the provided example to test it by just copying the example to your /etc/rsyslog.d/ directory in a linux
system like debian. If not existing, you have to install [syslog][5] first.

3. To test instantly you can use [socat][7] or just the bash-ism shell (maybe not on other shells)

`socat STDIO UDP4-DATAGRAM:localhost:6660`

or

`cat - > /dev/udp/localhost/6660`

And then just send some input to the socket.

4. Connectors
You find 2 connectors shipped. The amqpconnector and the fileconnector. If you need others,
you can easily add them (and contribute :)).

## Testing
In case of testing, the fileconnector is used.

1. Run `grunt test`
Just runs the tests.

## Production

1. Start clustered and recover on failure

`NODE_ENV=prod pm2 start syslogtoamqp.js -i max`

You can then have a look at [pm2][6].

# FAQ
1. I experience some "RangeError: Maximum call stack size exceeded" error.
This might be caused of some issues regarding the exchange. Have a look at your rabbitMQ error logs.

2. I use logger to send JSON strings, and they are not received correctly. Only if I add ' the message is correct.
Problem is with logger, which then recieves bash 'optimized' input. So please use socat to test or add ' to the message
sent.

# Bugs / Features
Please use https://github.com/DECK36/deck36-udp2amqp/issues to add feature requests and bugs.

# Contribute
Feel free to send PullRequests. We promise to review them fast.
