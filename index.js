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
    if(checkRedundantUserId(_Users, idUser)) {
      socket.emit('duplicated_connection', 'User already connected!');
      socket.disconnect();
    }
    else {
      if(isSync) {
        console.log('System already synchronized...');
      }
      else if(startedSync) {
        console.log('System synchronization already started...');
      }
      else {
        startedSync = true;
        if(checkExistentFile('.residence.bson')) {
          const data = readDataFromBSONFile('.residence.bson');
          if(data) {
            isSync = startOfflineSyncronization(io, data);
            startedSync = false;
          }
          else {
            isSync = startOnlineSyncronization(io, socket);
            startedSync = false;
          }
        }
        else {
          isSync = startOnlineSyncronization(io, socket);
          startedSync = false;
        }
      }
    }
  }
});

const { startOfflineSyncronization, startOnlineSyncronization } = require('./api/shared/sync'),
      { checkExistentFile, readDataFromBSONFile } = require('./api/shared/helpers'),
      { checkRedundantUserId, removeUserIdFromStore, storeUserId } = require('./api/shared/user-management'),
      _Users =  require('./api/collections/user');

module.exports = {
  io
};

require('dotenv').config({ path: '.env' });
require('./api/index');

server.listen(port || process.env.PORT, () => console.log(`Express listening on port ${port}...`));