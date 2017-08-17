const io = require('../../index.js'),
      board = require('../collections/board').board,
      createLed = require('../collections/component').createLed;

io.on('connection', socket => {
  socket.on('createComponent', data => {
    const { _id, digitalPin, type, idBoard } = data;
    switch (type) {
      case 1:
          const led = createLed(_id, 13);
          led.blink();
        break;
      default:
        return;
    };
  });
});
