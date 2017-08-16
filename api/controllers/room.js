const roomsCollection = require('../collections/room').roomsCollection,
      Room = require('../classes/room').Room,
      io = require('../../index.js');

io.on('connection', socket => {
  socket.on('createRoom', data => {
    const { _id, description, components } = data.Room,
            room = new Room(_id, description, components);
    roomsCollection.push(room);
  });
  socket.on('updateRoom', data => {
    const { id, description, components } = data,
          room = roomsCollection.filter(room => room.id === data.id);
          room.id = id;
          room.description = description;
          room.components = components;
  });
  socket.on('deleteRoom', id => {
    const index = roomsCollection.map(room => room.id === id);
    roomsCollection.splice(index, 1);
  });
});