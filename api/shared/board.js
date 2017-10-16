const five = require('johnny-five'),
      Etherport = require('etherport'),
      Board = five.Board;

function boardCreator(data) {
  const { id, port, description } = data;
  return createBoard(id, port, description);
}

function createBoard(id, port, description) {
  return new Board({
    id,
    port: new Etherport(port),
    custom: { description },
    repl: false, 
    debug: false,
    timeout: 1e5
  });
}

module.exports = {
  boardCreator
}