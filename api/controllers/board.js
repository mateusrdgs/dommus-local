const _Boards = require('../collections/board'),
      { boardCreator } = require('../shared/board'),
      { addItemToCollection } = require('../shared/helpers');

function createBoard(data) {
  const board = boardCreator(data);
  if(board) {
    addItemToCollection(_Boards, board);
  }
  return board;
}

module.exports = {
  createBoard
}