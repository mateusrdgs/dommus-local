const five = require('johnny-five'),
      Board = five.Board,
      Boards = five.Boards,
      Etherport = require('etherport');


function createBoard(data) {
  return data.length <=1 ? createSingleBoard(data[0]) : createArrayBoard(data);
}

function createSingleBoard(board) {
  const { _id } = board,
        port = '/dev/ttyUSB0';
  return new Board({
    id: _id,
    port,
    repl: false,
    debug: false
  });
}

function createArrayBoard(boards, board) {
  const ports = [];
  if(!boards.length) { // When on boards collection only has one board
    const id = boards.id, port = extractPortValue(boards.port),
          newId = board.id, newPort = extractPortValue(boards.port);
    addToPorts(ports, id, port, false, false); //Oldest board
    addToPorts(ports, newId, newPort, false, false); //Newest board
  }
  else { // When on boards collection has more then one board
    Array.prototype.forEach.call(boards, board => {
      const id = board.id, port = extractPortValue(board.port);
      addToPorts(ports, id, port, false, false); //Oldest boards
    });
    const newId = boards.id, newPort = extractPortValue(boards.port);
    addToPorts(ports, newId, newPort, false, false); // Newest board
  }
  return new Boards(ports);
}

function addToPorts(ports, id, port, repl, debug) {
  ports.push({ id, port: new Etherport(port), repl, debug });
}


function extractPortValue(port) {
  const splitted = port.split(' ');
  return parseInt(splitted[splitted.length - 1]);
}

module.exports = createBoard;