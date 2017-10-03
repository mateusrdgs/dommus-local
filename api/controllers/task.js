const five = require('johnny-five'),
      Led = five.Led,
      Servo = five.Servo,
      io = require('../../index').io,
      _Components = require('../collections/component');

io.on('connection', socket => {
  socket.on('create:Task', data => {
    const { _id, state, milliseconds } = data,
          component = _Components.filter(component => component.id === _id)[0];
    switch(component.constructor) {
      case Led: {
          if(state) {
            setTimeout(() => {
              component.on();
            }, milliseconds);
          }
          else {
            setTimeout(() => {
              component.off();
            }, milliseconds);
          }
        break;
      }
      case Servo: {
        break;
      }
    }
  });
  socket.on('update:Task', data => {
    console.log(data);
  });
  socket.on('delete:Task', data => {
    console.log(data);
  });
});