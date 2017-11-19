const five = require('johnny-five'),
      Etherport = require('etherport'),
      Board = five.Board,
      { filterItemFromCollectionByProperty } = require('./helpers');

function boardCreator(data) {
  const { id, port, description } = data;
  return new Board({
    id,
    port: new Etherport(parseInt(port)),
    custom: { description },
    repl: false, 
    debug: false,
    timeout: 1e5
  });
}

function boardsExtractor(_Boards) {
  return _Boards.map(_board => {
    const { id, custom, port} = _board,
          { description } = custom;
    return { id, description, port };
  });
}

function boardUpdater(_Boards, data) {
  const { id, description, port } = data,
        board = filterItemFromCollectionByProperty(_Boards, 'id', id);
  board.custom.description = description;
  //board.port = new Etherport(port);
  return board;
}


module.exports = {
  boardCreator,
  boardsExtractor,
  boardUpdater
}