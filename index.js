const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      port = 4000,
      server = require('http').createServer(app),
      io = require('socket.io')().listen(server);

let isSync = false,
    startedSync = false;

module.exports = {
  io,
  startedSync
};

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
  if(!isSync && !startedSync) {
    startedSyncEmitter.on('sync:Start', () => {
      startedSync = true;
      console.log('Started system synchronization...');
    });
    socket.emit('sync:App', sync(io));
    finishedSyncEmitter.on('sync:Finish', () => {
      isSync = true;
      console.log('Finished system synchronization');
    });
  }
});

require('./api/index');

const startedSyncEmitter = require('./api/shared/sync').startedSyncEmitter,
      finishedSyncEmitter = require('./api/shared/sync').finishedSyncEmitter,
      sync = require('./api/shared/sync').sync;
