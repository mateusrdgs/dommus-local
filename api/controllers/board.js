const _Boards = require('../collections/board'),
      { boardCreator, boardUpdater } = require('../shared/board'),
      { addItemToCollection } = require('../shared/helpers');

function createBoard(data) {
  const board = boardCreator(data);
  if(board) {
    addItemToCollection(_Boards, board);
  }
  return board;
}

function updateBoard(data) {
  const board = boardUpdater(_Boards, data);
  if(board) {
    return board;
  }
}

module.exports = {
  createBoard,
  updateBoard
}