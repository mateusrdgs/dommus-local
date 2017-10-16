const five = require('johnny-five'),
      Etherport = require('etherport'),
      _Boards = require('../collections/board');

function createBoard(board) {
  const newBoard = extractAndReturn(board);
  addToBoardsCollection(newBoard, _Boards);
  return newBoard;
}

function extractAndReturn(board) {
    const { id, port, description } = board;
    return new five.Board({
      id,
      port: new Etherport(parseInt(port)),
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

module.exports = createBoard;
