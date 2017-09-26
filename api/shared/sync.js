const _Boards = require('../collections/board'),
      _Components = require('../collections/component'),
      SyncEmitter = require('./events').SyncEmitter,
      startedSyncEmitter = new SyncEmitter(),
      finishedSyncEmitter = new SyncEmitter(),
      createComponent = require('../shared/componentCreator'),
      createBoard = require('../shared/boardCreator');

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
    startedSyncEmitter.emit('started:Sync');
    createBoards(io, dataBoards, dataRooms);
  }
  else {
    finishedSyncEmitter.emit('finished:Sync');
  }
}

function createBoards(io, dataBoards, dataRooms) {
  dataBoards.forEach(dataBoard => {
    createBoard(dataBoard);
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
        finishedSyncEmitter.emit('finished:Sync');
      }
    });
  });
}

function iterateOverRooms(io, dataRooms, _Components, _board) {
  if(Array.isArray(dataRooms)) {
    dataRooms.forEach(dataRoom => {
      const { id } = _board;
      const extractedComponents = extractComponentsFromRoom(dataRoom, id);
      iterateOverComponents(io, _Components, _board, extractedComponents);
    });
  }
}

function extractComponentsFromRoom(dataRoom, id) {
  const { components } = dataRoom;
  if(Array.isArray(components)) {
    return components.filter(component => component.idBoard === id);
  }
}

function iterateOverComponents(io, _Components, _board, extractedComponents) {
  if(Array.isArray(extractedComponents)) {
    extractedComponents.forEach(extractedComponent => {
      const newComponent = createComponent(io, extractedComponent, _board);
      addComponentToCollection(_Components, newComponent);
    });
    const { id } = _board;
    if(checkBoardId(id)) {
      finishedSyncEmitter.emit('finished:Sync');
    }
  }
}

function addComponentToCollection(_Components, newComponent) {
  _Components.push(newComponent);
}

function checkBoardId(id) {
  return id === _Boards[0].id;
}

module.exports = {
  sync,
  startedSyncEmitter,
  finishedSyncEmitter
};
