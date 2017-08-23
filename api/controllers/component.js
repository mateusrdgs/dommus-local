const io = require('../../index.js'),
      createComponent = require('../shared/componentCreator'),
      components = require('../collections/component');

io.on('connection', socket => {
  socket.on('create:Component', data => {
    const component = createComponent(socket, data, components);
    socket.emit('create:Component', !!component || false);
  });

  socket.on('get:Component', data => {
    returnComponent(socket, data);
  });

  socket.on('get:Components', data => {
    returnComponents(socket, components);
  });
});

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
