const _Components = require('../collections/component'),
      _Boards = require('../collections/board'),
      registerListener = require('../shared/register'),
      { componentCreator, componentUpdater, componentStateUpdater, componentStateVoiceUpdater, componentsExtractor, componentsDeleter } = require('../shared/component'),
      { addItemToCollection, filterItemFromCollectionByProperty } = require('../shared/helpers');


function createComponent(io, data) {
  const { idBoard } = data,
        board = filterItemFromCollectionByProperty(_Boards, 'id', idBoard),
        component = componentCreator(data, board);
  if(component) {
    addItemToCollection(_Components, component);
    registerListener(io, component);
  }
  return component;
}

function updateComponent(data) {
  const { id, idBoard } = data,
        board = filterItemFromCollectionByProperty(_Boards, 'id', idBoard),
        component = filterItemFromCollectionByProperty(_Components, 'id', id),
        index = _Components.indexOf(component);
  if(index >= 0) {
    _Components.splice(index, 1, componentUpdater(component, board, data));
  }
  return index >= 0;
}

function returnComponent(data) {
  const { id } = data;
  return filterItemFromCollectionByProperty(_Components, 'id', id);
}

function returnComponents() {
  return componentsExtractor(_Components);
}

function changeComponentState(data) {
  const { id } = data,
        component = filterItemFromCollectionByProperty(_Components, 'id', id);
  componentStateUpdater(component, data);
  return data;
}

function changeComponentStateVoice(voiceCommand) {
  return componentStateVoiceUpdater(_Components, voiceCommand);
}

function deleteComponent(data) {
  const { id } = data,
        component = filterItemFromCollectionByProperty(_Components, 'id', id);
  return componentsDeleter(_Components, component);
}

module.exports = {
  createComponent,
  updateComponent,
  returnComponent,
  changeComponentState,
  changeComponentStateVoice,
  returnComponents,
  deleteComponent
}