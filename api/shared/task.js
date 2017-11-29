const five = require('johnny-five'),
      Led = five.Led,
      Servo = five.Servo,
      mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId,
      _Tasks = require('../collections/task'),
      Task = require('../models/task'),
      _Components = require('../collections/component'),
      { addItemToCollection, filterItemFromCollectionByProperty, readDataFromBSONFile, writeDataOnBSONFile } = require('../shared/helpers');

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
  const { id: target, state, position, milliseconds } = data,
        component = filterItemFromCollectionByProperty(_Components, 'id', target),
        task = new Task(
          id,
          new Date().toLocaleDateString(),
          (state !== undefined ? state : position),
          { id: target, description: component.custom.description },
          false,
          milliseconds
        );

  addItemToCollection(_Tasks, task);
  saveOnBSONFile(_Tasks);
}

function changeTaskStatus(id, _Tasks) {
  const task = filterItemFromCollectionByProperty(_Tasks, 'id', id);
  task['status'] = true;
  saveOnBSONFile(_Tasks);
}

function saveOnBSONFile(_Tasks) {
  writeDataOnBSONFile('.tasks.bson', _Tasks);
}

module.exports = {
  taskCreator
}