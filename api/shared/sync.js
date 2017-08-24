const Components = require('../collections/component'),
      createComponent = require('../shared/componentCreator'),
      createBoard = require('../shared/boardCreator');

let Boards = require('../collections/board');

function sync(socket) {
  return function(data) {
    const { boards, rooms } = data;
    createBoards(boards);
    if(isBoardsReady(Boards)) {
      createComponents(socket, rooms);
    }
  }
}

function createBoards(boards) {
  if(boards) {
    Boards = createBoard(boards);
  }
}

function createComponents(socket, rooms) {
  rooms.forEach(room => {
    setTimeout(() => {
      const roomComponents = room.components;
      roomComponents.forEach(component => {
        const newComponent = createComponent(socket, component);
        Components.push(newComponent);
      });
    }, 5000);
  });
}

function isBoardsReady(boards) {
  const isReady = Array.prototype.every.call(boards, board => {
    return board.isReady;
  });
  if(!isReady) {
    setTimeout(() => {
      isBoardsReady(boards);
    }, 3000);
  }
  else {
    return isReady;
  }
}

module.exports = sync;
