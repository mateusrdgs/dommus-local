const io = require('../../index.js'),
      board = require('../collections/board').board,
      component = require('../classes/component'),
      components = require('../collections/component').components;

io.on('connection', socket => {
  socket.on('create:Component', data => {
    const { type } = data;
    switch (type) {
      case 1: { // LED
          console.log(data);
          const id = data._id,
                description = data.description,
                newLed = component.createLed(id, 13);
          components.push(newLed);
          console.log(`${description} created!`);
        break;
      }
      case 2: { // THERMOMETHER
          const { _id, description, controller, pin, freq } = data,
                newThermomether = component.createThermomether(_id, controller, pin, freq);
          components.push(newThermomether);
          registerListener(socket, newThermomether );
          console.log(`${description} created!`);
        break;
      }
      case 3: { // MOTION
          const { _id, description, controller, pin } = data,
                newMotion = component.createThermomether(_id, controller, pin, freq);
          components.push(newMotion);
          registerListener(socket, newMotion);
          console.log(`${description} created!`);
        break;
      }
      case 4: { // SENSOR
          const { _id, description, pin, threshold, freq } = data,
                newSensor = component.createSensor(_id, pin, threshold, freq);
          components.push(newSensor);
          registerListener(socket, newSensor);
          console.log(`${description} created!`);
        break;
      }
      case 5: { // SERVO
          const { _id, description, pin, minRange, maxRange } = data,
                newServo = component.createServo(_id,  pin, minRange, maxRange);
          components.push(newServo);
          console.log(`${description} created!`);
        break;
      }
      default: {
        return;
      }
    };
  });

  socket.on('get:Component', data => {
    const { _id } = data;
    socket.emit('get:Component', components.filter(component => component.id === _id));
  });

  socket.on('get:Components', data => {
    socket.emit('get:Components', true);
  });

});

function registerListener(socket, component) {
  component.on('data', function() {
    socket.emit('changed:Component', this);
  });
}
