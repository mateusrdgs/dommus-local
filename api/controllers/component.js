const io = require('../../index.js'),
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
  })

});

function returnComponent(socket, data) {
  const { _id } = data;
  socket.emit('get:Component', components.filter(component => component.id === _id));
}

function returnComponents(socket, components) {
  if(components.length) {
    const filteredComponents = [];
    components.forEach(comp => {
      const { id, pin, isOn, board, custom } = comp,
            boardId = board.id;
      filteredComponents.push({ id, pin, boardId, isOn, custom });
    });
    socket.emit('get:Components', filteredComponents);
  }
}

function updateStateComponent(socket, components, data) {
  const component = components.filter(component => component.id === data.id)[0];
  if(data.isOn) {
    component.on();
  }
  else {
    component.off();
  }
  io.emit('updateState:Component', data);
}