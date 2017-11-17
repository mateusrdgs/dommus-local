const BSON = require('bson'),
fs = require('fs'),
_Boards = require('../collections/board'),
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

function checkExistentFile(fileName) {
  return fs.existsSync(fileName);
}

function readDataFromFile(fileName) {
  return JSON.parse(fs.readFileSync(fileName));
}

function extractValues(object) {
  return Object.keys(object).map(key => object[key]);
}

function flatArray(arr, prevArr) {
  return [...arr, ...prevArr];
}

function checkIfIsObject(property) {
  return typeof property === 'object';
}

function returnTargetSplice(target, index, quantity) {
  target.splice(index, quantity);
  return target;
}

function returnEqualArraysLength() {
  //return Array.from(arguments).every(extArr => extArr.map(inArray => inArray.length).every(arr => arr.length === extArr.length));
}

function iterateOverObjectProperties(target, values, index) {
  if(Array.isArray(values) && index >= values.length) {
    return values;
  }
  else {
    if(!values) {
      return iterateOverObjectProperties(target, extractValues(target), 0);
    }
    else {
      if(checkIfIsObject(values[index])) {
        const extractedValues = extractValues(values[index]);
        return iterateOverObjectProperties(
          target,
          flatArray(
            returnTargetSplice(values, index, 1),
            extractedValues
          ),
          index
        );
      }
      else {
        return iterateOverObjectProperties(target, values, ++index);
      }
    }
  }
}

function verifyDataConsistency(data) {
  if(checkExistentFile('residence.json')) {
    const flatData = iterateOverObjectProperties(data, '', 0),
    flatDataFile = iterateOverObjectProperties(readDataFromFile('residence.json'), '', 0);
    if(Array.isArray(flatData) && Array.isArray(flatDataFile)) {
      if(flatData.length === flatDataFile.length) {
        const equalData = flatData.every(flatDataValue => flatDataFile.some(flatDataFileValue => flatDataValue === flatDataFileValue));
        if(equalData && !startedSync) {
          const { boards, rooms } = data;
          if(boards && rooms) {
            startSync(io, boards, rooms);
          }
          else {
            console.log('Nothing to sync...');
          }
        }
        else {
          
        }
      } else {
        fs.writeFileSync('residence.json', JSON.stringify(data));
      }
    }
  }
}

function sync(io) {
  return function(data) {
    if(data) {
      verifyDataConsistency(data);
    } else {
      /*if(!startedSync) {
        const { boards, rooms } = data;
        if(boards && rooms) {
          startSync(io, boards, rooms);
        }
        else {
          console.log('Nothing to sync...');
        }
      }*/
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
