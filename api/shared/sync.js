const Boards = require('../collections/board'),
      Components = require('../collections/component'),
      createComponent = require('../shared/componentCreator');

function sync(socket) {
  return function(data) {
    const { boards, rooms } = data;
    if(isBoardsReady(Boards)) {
      createComponents(socket, rooms);
    }
    //Boards = createBoards(boards);
  }
}

/*function createBoards(boards) {
  const { boards, rooms } = data;  
}*/

function isBoardsReady(boards) {
  const isBoardsReady = Array.prototype.every.call(boards, board => {
    return board.isReady;
  });
  if(!isBoardsReady) {
    setTimeout(() => {
      isBoardsReady(boards);
    }, 3000);
  }
  else {
    return isBoardsReady;
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

module.exports = sync;
