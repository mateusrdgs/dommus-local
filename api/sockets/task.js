const io = require('../../index').io,
      { createTask, returnTask, returnTasks } = require('../controllers/task');

io.on('connection', socket => {
  socket.on('task:Create', (data, callback) => {
    const createdTask = createTask(io, data);
    callback(createdTask);
  });
  socket.on('task:Get', (data, callback) => {
    const task = returnTask(data);
    callback(task);
  });
  socket.on('task:Update', data => {
    
  });
  socket.on('task:Delete', data => {
    
  });
  socket.on('tasks:Get', (data, callback) => {
    const tasks = returnTasks();
    callback(tasks);
  })
});