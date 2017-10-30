const _Tasks = require('../collections/task'),
      _Components = require('../collections/component'),
      { taskCreator } = require('../shared/task'),
      { filterItemFromCollectionByProperty } = require('../shared/helpers');

function createTask(io, data) {
  const { id } = data,
        component = filterItemFromCollectionByProperty(_Components, 'id', id);
  if(component) {
    return taskCreator(io, data, component);
  }
  return false;
}

function returnTask(data) {
  const { id } = data;
  return filterItemFromCollectionByProperty(_Tasks, 'id', id);
}

function returnTasks() {
  return _Tasks;
}

module.exports = {
  createTask,
  returnTask,
  returnTasks
}