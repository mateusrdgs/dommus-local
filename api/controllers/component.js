const _Components = require('../collections/component'),
      _Boards = require('../collections/board'),
      registerListener = require('../shared/register'),
      { componentCreator, componentUpdater, componentStateUpdater, componentStateVoiceUpdater, componentsExtractor } = require('../shared/component'),
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
        component = filterItemFromCollectionByProperty(_Components, 'id', id);
  return componentUpdater(component, board, data);
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

module.exports = {
  createComponent,
  updateComponent,
  returnComponent,
  changeComponentState,
  changeComponentStateVoice,
  returnComponents
}