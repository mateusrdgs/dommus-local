const io = require('../../index').io,
      { createComponent,
        returnComponent,
        updateComponent,
        returnComponents,
        changeComponentState
      } = require('../controllers/component');

io.on('connection', socket => {
  socket.on('component:Create', data => {
    const component = createComponent(io, data);
    socket.emit('component:Created', !!component);
  });
  socket.on('component:Get', data => {
    const component = returnComponent(data);
    socket.emit('component:Get', component);
  });
  socket.on('component:Update', data => {
    const component = updateComponent(data);
    //io.emit('component:Updated')
  });
  socket.on('component:Delete', data => {
    
  });
  socket.on('component:State', data => {
    const state = changeComponentState(data);
    socket.emit('component:State', state);
  });
  socket.on('components:Get', () => {
    const components = returnComponents();
    socket.emit('components:Get', components);
  });
});