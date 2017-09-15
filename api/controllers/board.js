const io = require('../../index').io,
      boardCreator = require('../shared/boardCreator');

io.on('connection', socket => {
  socket.on('create:Board', data => {
    const newBoard = boardCreator(data);
    console.log(newBoard);
  });
  socket.on('update:Board', data => {
    console.log(data);
    socket.emit('updated:Board', true);
  });
});