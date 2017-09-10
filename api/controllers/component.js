const io = require('../../index.js').io,
      five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Sensor = five.Sensor,
      Motion = five.Motion,
      Servo = five.Servo,
      createComponent = require('../shared/componentCreator'),
      components = require('../collections/component');

let Boards = require('../collections/board');

io.on('connection', socket => {
  socket.on('create:Component', data => {
    const component = createComponent(socket, data, Boards);
    components.push(component);
    socket.emit('create:Component', !!component || false);
  });
  
  socket.on('get:Component', data => {
    returnComponent(socket, data);
  });
  
  socket.on('get:Components', data => {
    returnComponents(socket, components);
  });
  
  socket.on('updateState:Component', data => {
    updateStateComponent(io, components, data);
  });
  
});

function returnComponent(socket, data) {
  const { _id } = data;
  socket.emit('get:Component', components.filter(component => component.id === _id));
}

function returnComponents(socket, components) {
  if(components.length) {
    const filteredComponents = [];
    components.forEach(component => {
      switch(component.constructor) {
        case Led: {
          let { id, pin, board, custom, isOn } = component,
                { description, type } = custom,
                boardId = board.id;
          filteredComponents.push({ boardId, description, type: parseInt(type), pin, isOn, id });
          break;
        }
        case Thermometer: {
          let { id, pin, board, custom, celsius, fahrenheit } = component,
                { description, type } = custom,
                boardId = board.id;
          filteredComponents.push({ boardId, description, type: parseInt(type), pin, celsius, fahrenheit, id });
          break;
        }
        case Light: {
          let { id, pin, board, custom, value } = component,
                { description, type } = custom,
                boardId = board.id;
          filteredComponents.push({ boardId, description, type: parseInt(type), pin, value, id });
          break;
        }
        case Motion: {
          let { id, pin, board, custom, isCalibrated, detectedMotion } = component,
                { description, type } = custom,
                boardId = board.id;
          filteredComponents.push({ boardId, description, type: parseInt(type), pin, isCalibrated, detectedMotion, id });
          break;
        }
        case Sensor: {
          let { id, pin, board, custom, value } = component,
            { description, type } = custom,
            boardId = board.id;
            filteredComponents.push({ boardId, description, type: parseInt(type), pin, value, id });
          break;
        }
        case Servo: {
          let { id, pin, board, custom, position, startAt, range } = component,
                { description, type, rotation } = custom,
                boardId = board.id;
          filteredComponents.push({ boardId, description, type: parseInt(type), pin, rotation, startAt, minRange: range[0], maxRange: range[1], id, position });
          break;
        }
      }
      
    });
    socket.emit('get:Components', filteredComponents);
  }
}

function updateStateComponent(io, components, data) {
  const { id } = data,
        component = components.filter(component => component.id === id)[0];
  switch(component.constructor) {
    case Led: {
      const { isOn } = data;
      if(isOn) {
        component.on();
      }
      else {
        component.off();
      }
      break;
    }
    case Servo: {
      let { position } = data;
      position = position === 180 ? position - 5 : position;
      console.log(position);
      component.to(position);
      break;
    }
  }
  io.emit('updateState:Component', data);
}