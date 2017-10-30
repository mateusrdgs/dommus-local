const _Components = require('../collections/component'),
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

module.exports = {
  createTask
}