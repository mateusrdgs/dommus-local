const io = require('../../index').io,
      { createBoard } = require('../controllers/board');

io.on('connection', socket => {
  socket.on('board:Create', data => {
    const board = createBoard(io, data);
    socket.emit('board:Created', !!board);
  });
  socket.on('board:Get', data => {
    
  });
  socket.on('board:Update', data => {
    console.log(data);
    socket.emit('board:Updated', true);
  });
  socket.on('board:Delete', data => {
    
  });
});