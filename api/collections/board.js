const five = require('johnny-five'),
      port = {
        id: 'Mega',
        port: '/dev/ttyUSB0',
        repl: false,
        debug: false
      },
      board = new five.Board(port);

board.on('ready', () => {
  console.log('Board ready!');
});

board.on('fail', event => {
  console.log(event.class, event.message);
});

module.exports = {
  board
}