const five = require('johnny-five'),
      Led = five.Led,
      Servo = five.Servo,
      mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId,
      _Tasks = require('../collections/task'),
      { addItemToCollection, filterItemFromCollectionByProperty } = require('../shared/helpers');

function taskCreator(io, data, component) {
  switch(component.constructor) {
    case Led: {
      return taskLed(io, data, component);
    }
    case Servo: {
      return taskServo(io, data, component);
    }
    default: {
      return false;
    }
  }
}

function taskLed(io, data, component) {
  const { id, state, milliseconds } = data,
        newId = new ObjectId().toHexString();
  if(state) {
    setTimeout(() => {
      component.on();
      changeTaskStatus(newId, _Tasks);
      io.emit('component:State', { id, isOn: state });
    }, milliseconds);
  }
  else {
    setTimeout(() => {
      component.off();
      changeTaskStatus(newId, _Tasks);
      io.emit('component:State', { id, isOn: state });
    }, milliseconds);
  }
  saveTask(newId, data, _Tasks);
  return true;
}

function taskServo(io, data, component) {
  const { id, position, milliseconds } = data,
        newId = new ObjectId().toHexString();
  setTimeout(() => {
    if(position) {
      setInterval(() => {
        component.to(position);
        changeTaskStatus(newId, _Tasks);
        io.emit('component:State', { id, position });
      }, milliseconds);
      saveTask(newId, data, _Tasks);
      return true;
    }
    return false;
  }, milliseconds);
}

function saveTask(id, data, _Tasks) {
  const { id: target, state, position, milliseconds } = data;
  if (state !== undefined) {
    const task = { id, target, state, milliseconds, status: false };
    addItemToCollection(_Tasks, task);
  }
  else {
    const task = { id, target, position, milliseconds, status: false };
    addItemToCollection(_Tasks, task);
  }
}

function changeTaskStatus(id, _Tasks) {
  const task = filterItemFromCollectionByProperty(_Tasks, 'id', id);
  task['status'] = true;
}

module.exports = {
  taskCreator
}