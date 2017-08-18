const five = require('johnny-five'),
      //collection = five.collection,
      boards = require('../collections/board').board,
      io = require('../../index.js');

io.on('connection', socket => {
  socket.on('create:Board', data => {
    console.log('Created!');
  });
});

function createBoard(boards, id, port, repl, debug, timeout) {
  const board = new five.Board({ id, port, repl, debug, timeout });
  board.on('ready', () => {
    console.log('Board ready');
  });
}
