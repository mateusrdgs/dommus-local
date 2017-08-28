const five = require('johnny-five'),
      Etherport = require('etherport'),
      io = require('../../index.js');

let boards = require('../collections/board');

io.on('connection', socket => {
  socket.on('create:Board', data => {
    const { _id, port } = data;
    boards = createBoard(boards, _id, port);
  });
});

function createBoard(boards, newId, newPort) {
  if(!boards) {
    return new five.Board({
      id: newId,
      port: new Etherport(newPort),
      repl: false,
      debug: false,
      timeout: false
    });
  }
  else {
    const ports = [];
    if(!boards.length) {
      addToPorts(ports, newId, newPort, false, false);
      return new five.Boards(ports);
    }
    /*else {
      Array.prototype.forEach.call(boards, board => {
        const id = board.id,
              repl = board.repl,
              debug = board.debug;
        let port = board.port;
        port = extractPortValue(port);
        addToPorts(ports, id, port, repl, debug);
      });
      addToPorts(ports, newId, newPort, false, false);
      return new five.Boards(ports);
    }*/
  }
}

function addToPorts(ports, id, port, repl, debug) {
  ports.push({ id, port: new Etherport(port), repl, debug });
}

function extractPortValue(port) {
  const splitted = port.split(' '),
  length = splitted.length;
  return parseInt(splitted[length - 1]);
}

function updateCollection(board, boards) {
  boards.prototype.add(board);
}