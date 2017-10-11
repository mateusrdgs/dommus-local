const io = require('../../index').io,
      boardCreator = require('../shared/boardCreator');

io.on('connection', socket => {
  socket.on('create:Board', data => {
    const newBoard = boardCreator(data);
    if(newBoard) {
      socket.emit('created:Board', true);
    }
  });
  socket.on('update:Board', data => {
    console.log(data);
    socket.emit('updated:Board', true);
  });
});