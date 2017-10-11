const _Boards = require('../collections/board'),
      _Components = require('../collections/component'),
      SyncEmitter = require('./events').SyncEmitter,
      startedSyncEmitter = new SyncEmitter(),
      finishedSyncEmitter = new SyncEmitter(),
      createComponent = require('../shared/componentCreator'),
      createBoard = require('../shared/boardCreator'),
      returnComponents = require('../controllers/component');

let startedSync = require('../../index').startedSync;

function sync(io, socket) {
  return function(data) {
    if(data && !startedSync) {
      const { boards, rooms } = data;
      if(boards && rooms) {
        startSync(io, socket, boards, rooms);
      }
      else {
        console.log('Nothing to sync...');
      }
    }
  }
}

function startSync(io, socket, dataBoards, dataRooms) {
  if((Array.isArray(dataBoards) && dataBoards.length > 0) && (Array.isArray(dataRooms) && dataRooms.length > 0)) {
    startedSyncEmitter.emit('started:Sync');
    createBoards(io, socket, dataBoards, dataRooms);
  }
  else {
    finishedSyncEmitter.emit('finished:Sync');
  }
}

function createBoards(io, socket, dataBoards, dataRooms) {
  dataBoards.forEach(dataBoard => {
    createBoard(dataBoard);
  });
  iterateOverBoards(io, socket, _Boards, _Components, dataRooms);
}

function iterateOverBoards(io, socket, _Boards, _Components, dataRooms) {
  _Boards.forEach(_board => {
    _board.on('ready', () => {
      if(Array.isArray(dataRooms) && dataRooms.length > 0) {
        iterateOverRooms(io, socket, dataRooms, _Components, _board);
      }
      else {
        console.log("No components to sync");
        finishedSyncEmitter.emit('finished:Sync');
      }
    });
  });
}

function iterateOverRooms(io, socket, dataRooms, _Components, _board) {
  if(Array.isArray(dataRooms)) {
    dataRooms.forEach(dataRoom => {
      const { id } = _board;
      const extractedComponents = extractComponentsFromRoom(dataRoom, id);
      iterateOverComponents(io, socket, _Components, _board, extractedComponents);
    });
  }
}

function extractComponentsFromRoom(dataRoom, id) {
  const { components } = dataRoom;
  if(Array.isArray(components)) {
    return components.filter(component => component.idBoard === id);
  }
}

function iterateOverComponents(io, socket, _Components, _board, extractedComponents) {
  if(Array.isArray(extractedComponents)) {
    extractedComponents.forEach(extractedComponent => {
      const newComponent = createComponent(io, socket, extractedComponent, _board);
      addComponentToCollection(_Components, newComponent);
    });
    const { id } = _board;
    if(checkBoardId(id)) {
      finishedSyncEmitter.emit('finished:Sync');
      returnComponents(io, _Components);
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
