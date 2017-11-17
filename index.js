const http = require('http'),
      express = require('express'),
      app = express(),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      port = 4000,
      /*options = {
        key: fs.readFileSync('/etc/openssl/remote-key.pem'),
        cert: fs.readFileSync('/etc/openssl/remote-cert.pem'),
        passphrase: process.env.PASSPHRASE,
        requestCert: false,
        rejectUnauthorized: false
      }*/
      server = http.createServer(app),
      io = require('socket.io')().listen(server);

let isSync = false,
    startedSync = false;

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', socket => {

  console.log('User connected...');

  const { idUser } = socket.handshake.query;

  socket.on('disconnect', () => {
    const removed = removeUserIdFromStore(_Users, idUser);
    if(removed) {
      console.log('User disconnected...');
    }
  });

  if(storeUserId(_Users, idUser)) {
    const redundantUser = checkRedundantUserId(_Users, idUser);
    if(redundantUser) {
      socket.emit('duplicated_connection', 'User already connected!');
      socket.disconnect();
    }
    else {
      if(startedSync && isSync) {
        console.log('Nothing to sync...')
      }
      else {
        if(checkExistentFile('residence.json')) {
          const data = readDataFromJSONFile('residence.json');
          if(data) {
            startOfflineSyncronization(syncEmitter, startedSync, isSync, sync, io, data);
          }
        }
        else {
          startOnlineSyncronization(syncEmitter, startedSync, socket, isSync);
        }
      }
    }
  }
});

function startOfflineSyncronization(syncEmitter, startedSync, isSync, sync, io, data) {
  syncEmitter.on('sync:Start', () => {
    startedSync = true;
    console.log('Started system synchronization...');
  });
  syncEmitter.on('sync:Finish', () => {
    isSync = true;
    console.log('Finished system synchronization...');
  });
  sync(io)(data);
}

function startOnlineSyncronization(syncEmitter, startedSync, socket, isSync) {
  syncEmitter.on('sync:Start', () => {
    startedSync = true;
    console.log('Started system synchronization...');
  });
  socket.emit('sync:App', sync(io));
  syncEmitter.on('sync:Finish', () => {
    isSync = true;
    console.log('Finished system synchronization...');
  });
}

const { syncEmitter, sync } = require('./api/shared/sync'),
      { checkExistentFile, readDataFromJSONFile } = require('./api/shared/helpers'),
      { checkRedundantUserId, removeUserIdFromStore, storeUserId } = require('./api/shared/user-management'),
      _Users =  require('./api/collections/user');

module.exports = {
  io,
  startedSync
};

require('dotenv').config({ path: '.env' });
require('./api/index');

server.listen(port || process.env.PORT, () => console.log(`Express listening on port ${port}...`));