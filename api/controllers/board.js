const io = require('../../index'),
      boardCreator = require('../shared/boardCreator');

io.on('connection', socket => {
  socket.on('create:Board', data => {
    boardCreator(false, data);
  });
});