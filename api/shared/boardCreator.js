const five = require('johnny-five'),
      Collection = five.Collection,
      Etherport = require('etherport');

let BoardsCollection = require('../collections/board');

function createBoard(isSync, data) {
  extractAndReturn(isSync, BoardsCollection, data);
  return BoardsCollection;
}

function extractAndReturn(isSync, boards, data) {
  if(Array.isArray(data)) {
    data.forEach(board => {
      const { _id, port, description } = board;
      Array.prototype.push.call(BoardsCollection, new five.Board({
        id: _id,
        port: new Etherport(port),
        custom: { description },
        repl: false,
        debug: false,
        timeout: 1e5
      }));
    });
  }
  else {
    const { _id, port, description } = data;
    Array.prototype.push.call(BoardsCollection, new five.Board({
      id: _id,
      port: new Etherport(port),
      custom: { description },
      repl: false,
      debug: false,
      timeout: 1e5
    }));
  }
  /*const configs = [];
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
    const { _id, port, description } = data;
    addToConfig(configs, _id, description, returnEtherport(port), false, false);
  }
  return returnBoards(configs);
  const { _id, port, description } = data;
  Array.prototype.push.call(boards, new five.Board({
    id: _id,
    port: returnEtherport(port), 
    repl: false,
    debug: false,
    custom: { description },
    timeout: 1e5
  }));*/
}

function iterateOverBoards(boards, configs) {
  Array.prototype.forEach.call(boards, board => {
    const { _id, repl, debug, description } = board;
    //const { description } = custom;
    let { port } = board;
    //port = extractPortValue(port);
    port = returnEtherport(port);
    addToConfig(configs, _id, description, port, repl, debug);
  });
}

function addToConfig(configs, id, description, port, repl, debug) {
  configs.push({ id, port, repl, debug, custom: { description },  timeout: 1e5 });
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