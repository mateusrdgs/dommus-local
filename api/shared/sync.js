const components = require('../collections/component'),
      createComponent = require('../shared/creator').createComponent;

function sync(socket) {
  return function(data) {
    const { boards, rooms } = data;
    rooms.forEach(room => {
      setTimeout(() => {
        const components = room.components;
        components.forEach(component => {
          const newComponent = createComponent(socket, component);
          components.push(newComponent);
        });
      }, 5000);
    });
  }
}

module.exports = sync;
