const five = require('johnny-five'),
      Thermometer = five.Thermometer;

function registerListener(socket, component) {
  component.on('data', function() {
    if(this instanceof Thermometer) {
      const { id, board, controller, celsius, fahrenheit, pin } = this,
            boardId = board.id;
      socket.emit(`changed:${id}`, { id, boardId, controller, celsius, fahrenheit, pin });
    }
  });
}

module.exports = registerListener;