const five = require('johnny-five'),
      boards = require('../collections/board').boards,
      io = require('../../index.js');

io.on('connection', socket => {
  console.log('user connected');
  socket.on('createBoard', data => {
    const { _id } = data;
    createBoard(boards, _id, '/dev/ttyUSB0', false, false, 30);
  });  
});

function createBoard(boards, id, port, repl, debug, timeout) {
  const board = new five.Board({ id, port, repl, debug, timeout });
  board.on('ready', () => {
    console.log('teste');
  });
}