const rooms = require('../collections/room').rooms,
      Room = require('../classes/room').Room,
      io = require('../../index.js');

io.on('connection', socket => {
  socket.on('create:Room', data => {
    const { _id, description, components } = data;
    rooms.push(new Room(_id, description, components));
    console.log(`${description} created!`);
  });
  socket.on('update:Room', data => {
    const { _id, description, components } = data;
    let filteredRoom = rooms.filter(room => room.id === _id);
          filteredRoom = { description, components };
  });
  socket.on('delete:Room', id => {
    const index = rooms.map(room => room.id === id);
    rooms.splice(index, 1);
  });
});
