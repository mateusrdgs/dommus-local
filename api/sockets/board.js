const io = require('../../index').io,
      { createBoard, updateBoard } = require('../controllers/board');

io.on('connection', socket => {
  socket.on('board:Create', (data, callback) => {
    const board = createBoard(io, data);
    callback(!!board);
  });
  socket.on('board:Get', data => {
    
  });
  socket.on('board:Update', (data, callback) => {
    const board = updateBoard(data);
    callback(!!board);
  });
  socket.on('board:Delete', data => {
    
  });
});