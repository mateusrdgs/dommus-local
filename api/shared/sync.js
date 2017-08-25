const SyncEmitter = require('./events').SyncEmitter,
      syncEmitter = new SyncEmitter(),
      Components = require('../collections/component'),
      createComponent = require('../shared/componentCreator'),
      createBoard = require('../shared/boardCreator');

let Boards = require('../collections/board');

function sync(socket) {
  return function(data) {
    const { boards, rooms } = data;
    createBoardsAndComponents(socket, boards, rooms);
  }
}

function createBoardsAndComponents(socket, boards, rooms) {
  if(boards) {
    Boards = createBoard(boards);
    Boards.on('ready', () => {
      createComponents(socket, rooms, Boards);
    });
  }
}

function createComponents(socket, rooms, boards) {
  rooms.forEach(room => {
    const roomComponents = room .components;
    roomComponents.forEach(component => {
      const newComponent = createComponent(socket, component, boards);
      Components.push(newComponent);
    });
  });
  syncEmitter.emit('finished:Sync');
}

module.exports = { 
  sync,
  syncEmitter
};
