const five = require('johnny-five'),
      Etherport = require('etherport');

let BoardsCollection = require('../collections/board');

function createBoard(isSync, data) {
  BoardsCollection = extractAndReturn(isSync, BoardsCollection, data);
  return BoardsCollection;
}

function extractAndReturn(isSync, boards, data) {
  const configs = [];
  if(isSync && boards.length) {
    iterateOverBoards(boards, configs);
  }
  else if(isSync && data.length) {
    iterateOverBoards(data, configs);
  }
  else {
    if(boards.length) {
      iterateOverBoards(boards, configs);
    }
    const { _id, port, description } = data[0];
    addToConfig(configs, _id, description, port, false, false);
  }
  return returnBoards(configs);
}

function iterateOverBoards(boards, configs) {
  Array.prototype.forEach.call(boards, board => {
    const { _id, repl, debug, description } = board;
    //const { description } = custom;
    let { port } = board;
    /*port = extractPortValue(port);
    port = returnEtherport(port);*/
    addToConfig(configs, _id, description, port, repl, debug);
  });
}

function addToConfig(configs, id, description, port, repl, debug) {
  configs.push({ id, port: '/dev/ttyUSB0', repl, debug, custom: { description },  timeout: 1e5 });
}

function returnBoards(configs) {
  return new five.Boards(configs);
}

function extractPortValue(port) {
  const splitted = port.split(' '),
  length = splitted.length;
  return parseInt(splitted[length - 1]);
}

function returnEtherport(port) {
  return new Etherport(port);
}

module.exports = createBoard;