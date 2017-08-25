const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      port = 4000,
      server = require('http').createServer(app),
      io = require('socket.io')().listen(server),
      sync = require('./api/shared/sync').sync,
      syncEmitter = require('./api/shared/sync').syncEmitter;

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
    socket.emit('app:Sync', sync(socket));
    syncEmitter.on('finished:Sync', () => {
      isSync = !isSync;
      console.log(isSync);
    });
  }
});

module.exports = io;

require('./api/index');
