const five = require('johnny-five'),
      Etherport = require('etherport'),
      _Boards = require('../collections/board');

function createBoard(board) {
  const newBoard = extractAndReturn(board);
  addToBoardsCollection(newBoard, _Boards);
  return newBoard;
}

function extractAndReturn(board) {
    const { _id, port, description } = board;
    return new five.Board({
      id: _id,
      port: '/dev/ttyUSB0',//new Etherport(port),
      custom: { description },
      repl: false,
      debug: false,
      timeout: 1e5
    });
}

function addToBoardsCollection(newBoard, _Boards) {
  if(Array.isArray(_Boards)) {
    _Boards.push(newBoard);
  }
}

function extractPortValue(port) {
  const splitted = port.split(' '),
  length = splitted.length;
  return parseInt(splitted[length - 1]);
}

function returnEtherport(port) {
  return new Etherport(port);
}

module.exports = createBoard;