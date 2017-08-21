const five = require('johnny-five'),
      Etherport = require('etherport'),
      ports = [{
        id: "UNO",
        port: "/dev/ttyUSB0",
        repl: false,
        debug: false
      }],
      /*ports = [{
        id: "UNO",
        port: new Etherport(55006),
        repl: false,
        debug: false
      }, {
        id: "MEGA",
        port: new Etherport(55007),
        repl: false,
        debug: false
        }],*/
      boards = new five.Boards(ports);
/*

let boards;

boards.on('ready', function() {
  console.log(`Boards ready`);
});


board.on('fail', function(event) {
  console.log(event.class, event.message);
});

setTimeout(() => {
  board = new five.Board(port);
  board.on('ready', function() {
    console.log(`Board '${board.id}' ready`);
  });
}, 10000);

*/

module.exports = {
  boards
}