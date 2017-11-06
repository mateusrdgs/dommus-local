const io = require('../../index').io,
      _Components = require('../collections/component'),
      { createComponent,
        returnComponent,
        updateComponent,
        returnComponents,
        changeComponentState
      } = require('../controllers/component'),
      levenstheinDistance = require('../shared/levenshtein');

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
    changeComponentStateVoice(io, data);
  })
  socket.on('components:Get', () => {
    const components = returnComponents();
    socket.emit('components:Get', components);
  });
});

function changeComponentStateVoice(io, data) {
  const [component] = 
    _Components.filter(component => component.custom.command
                                                    .some(command => {
                                                      const distance = levenstheinDistance(
                                                                         command.toLowerCase(),
                                                                         data.toLowerCase()
                                                                       );
                                                      return 1 - (distance / command.length) >= 0.75;
                                                    }));
  if(component) {
    const on = component.custom.command[0],
          off = component.custom.command[1],
          onDistance = levenstheinDistance(data, on),
          offDistance = levenstheinDistance(data, off);
    if(onDistance < offDistance) {
      component.on();
    }
    else {
      component.off();
    }
    io.emit('component:State', { id: component.id, isOn: component.isOn });
  }
}

function changeState(data) {
  console.log(data);
  const [ component ] = _Components.filter(component => component.custom.command.toLowerCase() === data.toLowerCase());
  if (component) {
    if(component.isOn) {
      component.off();
    }
    else {
      component.on();
    }
    io.emit('component:State', { id: component.id, isOn: component.isOn });
  }
}