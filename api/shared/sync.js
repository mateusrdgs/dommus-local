const SyncEmitter = require('./events').SyncEmitter,
      startedSyncEmitter = new SyncEmitter(),
      finishedSyncEmitter = new SyncEmitter(),
      createComponent = require('../shared/componentCreator'),
      createBoard = require('../shared/boardCreator');

let startedSync = require('../../index').startedSync,
    BoardsCollection = require('../collections/board'),
    ComponentsCollection = require('../collections/component');

function sync(io) {
  return function(data) {
    if(data && !startedSync) {
      const { boards, rooms } = data;
      if(boards && rooms) {
        createBoardsAndComponents(io, boards, rooms);
      }
      else {
        console.log('Nothing to sync...');
      }
    }
  }
}

function createBoardsAndComponents(io, boards, rooms) {
  if(boards.length) {
    startedSyncEmitter.emit('started:Sync');
    BoardsCollection = createBoard(true, boards);
    BoardsCollection.on('ready', () => {
      console.log('Finished boards synchronization...');
      createComponents(io, rooms, BoardsCollection);
    });
  }
}

function createComponents(io, rooms, boards) {
  if(rooms.length) {
    rooms.forEach(room => {
      const roomComponents = room .components;
      if(roomComponents.length) {
        roomComponents.forEach(component => {
          const newComponent = createComponent(io, component, boards);
          ComponentsCollection.push(newComponent);
        });
      }
    });
  }
  console.log('Finished components synchronization...');
  finishedSyncEmitter.emit('finished:Sync');
}

module.exports = { 
  sync,
  startedSyncEmitter,
  finishedSyncEmitter
};
