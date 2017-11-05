const _Boards = require('../collections/board'),
      _Components = require('../collections/component'),
      SyncEmitter = require('./events').SyncEmitter,
      startedSyncEmitter = new SyncEmitter(),
      finishedSyncEmitter = new SyncEmitter(),
      componentCreator = require('../shared/component').componentCreator,
      componentsExtractor = require('../shared/component').componentsExtractor,
      addItemToCollection = require('../shared/helpers').addItemToCollection,
      { boardCreator } = require('../shared/board'),
      registerListener =  require('../shared/register');

let startedSync = require('../../index').startedSync;

function sync(io) {
  return function(data) {
    if(data && !startedSync) {
      const { boards, rooms } = data;
      if(boards && rooms) {
        startSync(io, boards, rooms);
      }
      else {
        console.log('Nothing to sync...');
      }
    }
  }
}

function startSync(io, dataBoards, dataRooms) {
  if((Array.isArray(dataBoards) && dataBoards.length > 0) && (Array.isArray(dataRooms) && dataRooms.length > 0)) {
    startedSyncEmitter.emit('sync:Start');
    createBoards(io, dataBoards, dataRooms);
  }
  else {
    finishedSyncEmitter.emit('sync:Finish');
  }
}

function createBoards(io, dataBoards, dataRooms) {
  dataBoards.forEach(dataBoard => {
    const board = boardCreator(dataBoard);
    addItemToCollection(_Boards, board);
  });
  iterateOverBoards(io, _Boards, _Components, dataRooms);
}

function iterateOverBoards(io, _Boards, _Components, dataRooms) {
  _Boards.forEach(_board => {
    _board.on('ready', () => {
      if(Array.isArray(dataRooms) && dataRooms.length > 0) {
        iterateOverRooms(io, dataRooms, _Components, _board);
      }
      else {
        console.log("No components to sync");
        finishedSyncEmitter.emit('sync:Finish');
      }
    });
  });
}

function iterateOverRooms(io, dataRooms, _Components, _board) {
  if(Array.isArray(dataRooms)) {
    const extractedComponents = dataRooms.map(dataRoom => dataRoom['components'])
                                         .reduce((prev, curr) => { return prev.concat(curr) }, []);
    iterateOverComponents(io, _Components, _board, extractedComponents);
  }
}

function iterateOverComponents(io, _Components, _board, extractedComponents) {
  if(Array.isArray(extractedComponents)) {
    extractedComponents.forEach(extractedComponent => {
      if(_board['id'] === extractedComponent['idBoard']) {
        const component = componentCreator(extractedComponent, _board);
        if(component) {
          registerListener(io, component)
          addItemToCollection(_Components, component);
        }
      }
    });
    if(extractedComponents.length === _Components.length) {
      finishedSyncEmitter.emit('sync:Finish');
      io.emit('components:Get', componentsExtractor(_Components));
    }
  }
}

module.exports = {
  sync,
  startedSyncEmitter,
  finishedSyncEmitter
};
