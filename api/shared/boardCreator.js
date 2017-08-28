const five = require('johnny-five'),
      Etherport = require('etherport'),
      Board = five.Board,
      Boards = five.Boards;

let BoardsCollection = require('../collections/board');

function createBoard(data) {
  BoardsCollection = data.length <=1 ? createSingleBoard(data[0]) : createArrayBoard(data);
  return BoardsCollection;
}

function createSingleBoard(board) {
  const { _id, port } = board;
  return new Board({
    id: _id,
    port: new Etherport(port),
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
      const id = board._id, port = extractPortValue(board.port);
      addToPorts(ports, id, port, false, false); //Oldest boards
    });
  }
  return new Boards(ports);
}

function addToPorts(ports, id, port, repl, debug) {
  ports.push({ id, port: new Etherport(port), repl, debug });
}


function extractPortValue(port) {
  const splitted = port.toString().split(' ');
  return parseInt(splitted[splitted.length - 1]);
}

module.exports = createBoard;