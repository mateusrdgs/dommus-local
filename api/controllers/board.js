const five = require('johnny-five'),
      //collection = five.collection,
      board = require('../collections/board').board,
      io = require('../../index.js');

io.on('connection', socket => {
  console.log('user connected');
  socket.on('createBoard', data => {
    
  });  
});

function createBoard(boards, id, port, repl, debug, timeout) {
  const board = new five.Board({ id, port, repl, debug, timeout });
  board.on('ready', () => {
    console.log('teste');
  });
}