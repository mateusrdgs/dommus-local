const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId,
      port = 4000,
      server = require('http').createServer(app),
      io = require('socket.io')().listen(server),
      _Users =  require('./api/collections/user');

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

  const { idUser } = socket.handshake.query;

  socket.on('disconnect', () => {
    const removed = removeUserIdFromStore(_Users, idUser);
    if(removed) {
      console.log('User disconnected');
    }
  });

  const stored = storeUserId(_Users, idUser);

  if(stored) {
    const redundant = checkRedundantUserId(_Users, idUser);
    if(redundant) {
      socket.emit('duplicated_connection', 'User already connected!');
      socket.disconnect();
    }
    else {
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
    }
  }
});

require('./api/index');

const startedSyncEmitter = require('./api/shared/sync').startedSyncEmitter,
      finishedSyncEmitter = require('./api/shared/sync').finishedSyncEmitter,
      sync = require('./api/shared/sync').sync;

function storeUserId(_Users, idUser) {
  if(ObjectId.isValid(idUser)) {
    _Users.push(idUser);
    return true;
  }
  else {
    return false;
  }
}

function checkRedundantUserId(_Users, idUser) {
  return _Users.filter(user => user === idUser).length > 1;
}

function removeUserIdFromStore(_Users, idUser) {
  const index = checkUserId(_Users, idUser);
  if(index >= 0) {
    _Users.splice(index, 1);
  }
  return true;
}

function checkUserId(_Users, idUser) {
  return _Users.lastIndexOf(idUser);
}