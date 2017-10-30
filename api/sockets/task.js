const io = require('../../index').io,
      { createTask } = require('../controllers/task');

io.on('connection', socket => {
  socket.on('task:Create', (data, callback) => {
    const createdTask = createTask(io, data);
    callback(createdTask);
  });
  socket.on('task:Get', data => {
    
  });
  socket.on('task:Update', data => {
    
  });
  socket.on('task:Delete', data => {
    
  });
});