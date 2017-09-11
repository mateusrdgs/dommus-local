const io = require('../../index.js').io,
      five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Sensor = five.Sensor,
      Motion = five.Motion,
      Servo = five.Servo,
      createComponent = require('../shared/componentCreator'),
      _Components = require('../collections/component'),
      _Boards = require('../collections/board');

io.on('connection', socket => {
  socket.on('create:Component', data => {
    const { idBoard } = data,
          filteredBoard = filterBoardById(_Boards, idBoard),
          newComponent = createComponent(socket, data, filteredBoard);
    addComponentToCollection(_Components, newComponent);
    socket.emit('create:Component', !!newComponent || false);
  });
  
  socket.on('get:Component', data => {
    returnComponent(socket, data);
  });
  
  socket.on('get:Components', data => {
    if(data)
      returnComponents(socket, _Components);
  });
  
  socket.on('updateState:Component', data => {
    if(data)
      updateComponentState(io, _Components, data);
  });
  
});

function addComponentToCollection(_Components, newComponent) {
  _Components.push(newComponent);
}

function returnComponent(socket, data) {
  const { _id } = data;
  socket.emit('get:Component', _Components.filter(component => component.id === _id));
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

function updateComponentState(io, components, data) {
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
      position = position === 180 ? position - 10 : position;
      component.to(position);
      break;
    }
  }
  io.emit('updateState:Component', data);
}


function filterBoardById(_Boards, id) {
  return _Boards.filter(_board => _board.id === id)[0];
}