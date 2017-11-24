const _Tasks = require('../collections/task'),
      _Components = require('../collections/component'),
      { taskCreator } = require('../shared/task'),
      { filterItemFromCollectionByProperty, readDataFromBSONFile } = require('../shared/helpers');

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
  const tasks = readDataFromBSONFile('.tasks.bson'),
        tasksArray = [];
  if(tasks) {
    for (const key in tasks) {
      if (tasks.hasOwnProperty(key)) {
        tasksArray.push(tasks[key]);
      }
    }
    return tasksArray;
  }
}

module.exports = {
  createTask,
  returnTask,
  returnTasks
}