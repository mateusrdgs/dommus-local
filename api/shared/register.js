const five = require('johnny-five'),
      Thermometer = five.Thermometer,
      Light = five.Light;

function registerListener(io, component) {
  component.on('data', function() {
    switch(this.constructor) {
      case Thermometer: {
        const { id, board, controller, celsius, fahrenheit, pin } = this,
              boardId = board.id;
        io.emit(`changed:${id}`, { id, boardId, controller, celsius, fahrenheit, pin });
      }
      break;
      case Light: {
        const { id, board, pin, value, custom } = this,
              boardId = board.id;
        io.emit(`changed:${id}`, { id, boardId, custom, pin, value });
      }
      break;
    }
  });
}

module.exports = registerListener;