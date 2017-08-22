const io = require('../../index.js'),
      component = require('../classes/component'),
      components = require('../collections/component').components,
      registerListener = require('../helpers/register').registerListener;

io.on('connection', socket => {
  socket.on('create:Component', data => {
    const created = createComponent(socket, data, components);
    socket.emit('create:Component', created || false);
  });

  socket.on('get:Component', data => {
    returnComponent(socket, data);
  });

  socket.on('get:Components', data => {
    returnComponents(socket, components);
  });
});

function createComponent(socket, data, components) {
  const { type } = data;
  switch (type) {
    case 1: { // LED
        const id = data._id,
              idBoard = data.idBoard,
              description = data.description,
              newLed = component.createLed(id, 13, idBoard);
        components.push(newLed);
        console.log(`${description} created!`);
      return true;
    }
    case 2: { // THERMOMETHER
        const { _id, description, controller, pin, freq } = data,
              newThermomether = component.createThermomether(_id, controller, pin, freq);
        components.push(newThermomether);
        registerListener(socket, newThermomether);
        console.log(`${description} created!`);
      return true;
    }
    case 3: { // MOTION
        const { _id, description, controller, pin } = data,
              newMotion = component.createThermomether(_id, controller, pin, freq);
        components.push(newMotion);
        registerListener(socket, newMotion);
        console.log(`${description} created!`);
      return true;
    }
    case 4: { // SENSOR
        const { _id, description, pin, threshold, freq } = data,
              newSensor = component.createSensor(_id, pin, threshold, freq);
        components.push(newSensor);
        registerListener(socket, newSensor);
        console.log(`${description} created!`);
      return true;
    }
    case 5: { // SERVO
        const { _id, description, pin, minRange, maxRange } = data,
              newServo = component.createServo(_id,  pin, minRange, maxRange);
        components.push(newServo);
        console.log(`${description} created!`);
      return true;
    }
    default: {
      return false;
    }
  }
}

function returnComponent(socket, data) {
  const { _id } = data;
  socket.emit('get:Component', components.filter(component => component.id === _id));
}

function returnComponents(socket, components) {
  if(components.length) {
    const filteredComponents = [];
    components.forEach(comp => {
      const { id, pin, isOn, board } = comp,
            boardId = board.id;
      filteredComponents.push({ id, pin, boardId, isOn });
    });
    socket.emit('get:Components', filteredComponents);
  }
}
