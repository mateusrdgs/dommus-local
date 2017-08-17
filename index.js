const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      port = 4000,
      server = require('http').createServer(app),
      io = require('socket.io')().listen(server);

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(port || process.env.PORT, () => console.log(`Express listening on port ${port}`));

io.on('connection', socket => {
  console.log('User connected');
});

module.exports = io;

require('./api/index');
