const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      Promise = require('bluebird'),
      port = 4000,
      server = require('http').createServer(app),
      io = require('socket.io')().listen(server),
      sync = require('./api/helpers/sync').sync;

let isSync = false;

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(port || process.env.PORT, () => console.log(`Express listening on port ${port}`));

io.on('connection', socket => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  if(!isSync) {
    socket.emit('app:Sync', isSync);
    socket.on('app:Sync', data => {
      console.log(data);
    });
  }
});

module.exports = io;

require('./api/index');
