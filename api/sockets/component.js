const io = require('../../index').io,
      { createComponent,
        returnComponent,
        updateComponent,
        returnComponents,
        changeComponentState,
        changeComponentStateVoice
      } = require('../controllers/component');

io.on('connection', socket => {
  socket.on('component:Create', (data, callback) => {
    const component = createComponent(io, data);
    callback(!!component);
  });
  socket.on('component:Get', data => {
    const component = returnComponent(data);
    socket.emit('component:Get', component);
  });
  socket.on('component:Update', (data, callback) => {
    const component = updateComponent(data);
    callback(!!component);
  });
  socket.on('component:Delete', data => {
    
  });
  socket.on('component:State', data => {
    const state = changeComponentState(data);
    io.emit('component:State', state);
  });
  socket.on('component:StateVoice', data => {
    const state = changeComponentStateVoice(data);
    if(state && state.hasOwnProperty('id')) {
      io.emit('component:State', state);
    }
  })
  socket.on('components:Get', () => {
    const components = returnComponents();
    socket.emit('components:Get', components);
  });
});