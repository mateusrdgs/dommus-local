const SyncEmitter = require('./events').SyncEmitter,
      syncEmitter = new SyncEmitter(),
      createComponent = require('../shared/componentCreator'),
      createBoard = require('../shared/boardCreator');

let BoardsCollection = require('../collections/board'),
    ComponentsCollection = require('../collections/component');

function sync(socket) {
  return function(data) {
    if(data) {
      const { boards, rooms } = data;
      if(boards && rooms) {
        createBoardsAndComponents(socket, boards, rooms);
      }
      else {
        console.log('Nothing to sync...');
      }
    }
  }
}

function createBoardsAndComponents(socket, boards, rooms) {
  if(boards.length) {
    console.log('Started system synchronization...');
    BoardsCollection = createBoard(boards);
    BoardsCollection.on('ready', () => {
      console.log('Finished boards synchronization...');
      createComponents(socket, rooms, BoardsCollection);
    });
  }
}

function createComponents(socket, rooms, boards) {
  if(rooms.length) {
    rooms.forEach(room => {
      const roomComponents = room .components;
      if(roomComponents.length) {
        roomComponents.forEach(component => {
          const newComponent = createComponent(socket, component, boards);
          ComponentsCollection.push(newComponent);
        });
      }
    });
  }
  console.log('Finished components synchronization...');
  syncEmitter.emit('finished:Sync');
}

module.exports = { 
  sync,
  syncEmitter
};
