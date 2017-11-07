const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Sensor = five.Sensor,
      Motion = five.Motion,
      Servo = five.Servo,
      levenshteinDistance = require('./levenshtein');

function componentCreator(data, board) {
  const { type } = data;
  switch (parseInt(type)) {
    case 1: { // LED
      return createLed(data, board);
    }
    case 2: { // THERMOMETER
      return createThermometer(data, board);
    }
    case 3: { // LIGHT
      return createLight(data, board);
    }
    case 4: { // MOTION
      return createMotion(data, board);
    }
    case 5: { // SENSOR
      return createSensor(data, board);
    }
    case 6: { // SERVO
      return createServo(data, board);
    }
    default: {
      return false;
    }
  }
}

function componentsExtractor(_Components) {
  return _Components.map(_component => {
    switch(_component.constructor) {
      case Led: {
        return filterLed(_component);
      }
      case Thermometer: {
        return filterThermometer(_component);
      }
      case Light: {
        return filterLight(_component);
      }
      case Motion: {
        return filterMotion(_component);
      }
      case Sensor: {
        return filterSensor(_component);
      }
      case Servo: {
        return filterServo(_component);
      }
    }
  });
}

function componentUpdater(component, board, data) {
  switch(component.constructor) {
    case Led: {
      updateLedOrMotion(component, data, board);
      break;
    }
    case Thermometer: {
      updateThermometer(component, data, board);
      break;
    }
    case Light: {
      updateLightOrSensor(component, data, board);
      break;
    }
    case Motion: {
      updateLedOrMotion(component, data, board);
      break;
    }
    case Sensor: {
      updateLightOrSensor(component, data, board);
      break;
    }
    case Servo: {
      updateServo(component, data, board);
      break;
    }
    default: {
      return false;
    }
  }
  return componentsExtractor([component]);
}

function componentStateUpdater(component, data) {
  switch(component.constructor) {
    case Led: {
        updateLedState(component, data);
      break;
    }
    case Servo: {
        updateServoState(component, data);
      break;
    }
  }
}

function componentStateVoiceUpdater(_Components, voiceCommand) {
  const components = filterComponentsByLevenshteinDistance(_Components, voiceCommand);
  if(Array.isArray(components)) {
    const [ component ] = components;
    if(component) {
      switch (component.constructor) {
        case Light:
            updateLedStateVoice(component, voiceCommand);
          break;
        case Servo:
            updateServoStateVoice(component, voiceCommand);
          break;
        default:
          break;
      }
    }
  }
}

function createLed(data, board) {
  const { id, digitalPin, type, description, command } = data;
  return new Led({
    id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description, command }
  });
}

function createThermometer(data, board) {
  const { id, analogPin, frequency, type, description } = data;
  return new Thermometer({
    id,
    pin: `A${analogPin}`,
    freq: frequency,
    controller: 'LM35',
    board,
    custom: { type: parseInt(type), description }
  });
}

function createLight(data, board) {
  const { id, analogPin, frequency, threshold, type, description } = data;
  return new Light({
    id,
    pin: `A${analogPin}`,
    freq: frequency,
    controller: "DEFAULT",
    threshold: 1,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createMotion(data, board) {
  const { id, digitalPin, type, description } = data;
  return new Motion({
    id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createSensor(data, board) {
  const { id, analogPin, threshold, frequency, type, description } = data;
  return new Sensor({
    id,
    pin: `A${analogPin}`,
    threshold,
    freq: frequency,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createServo(data, board) {
  const { id, digitalPin, range, startAt, type, description, rotation, command } = data;
  return new Servo({
    id,
    pin: digitalPin,
    startAt,
    range,
    board,
    custom: { type: parseInt(type), description, rotation, command }
  });
}

function updateLedOrMotion(component, data, board) {
  const { description, digitalPin, command } = data;
  component.custom.description = description || component.custom.description;
  component.pin = digitalPin || component.pin;
  component.board = board;
  component.io = board;
  if(component.custom.hasOwnProperty('command')) {
    component.custom.command = command;
  }
}

function updateThermometer(component, data, board) {
  const { description, analogPin, frequency } = data;
  component.custom.description = description || component.custom.description;
  component.pin = analogPin || component.pin;
  component.freq = frequency || component.freq;
  component.board = board;
  component.io = board;
}

function updateLightOrSensor(component, data, board) {
  const { description, analogPin, frequency, threshold } = data;
  component.custom.description = description || component.custom.description;
  component.pin = analogPin || component.pin;
  component.freq = frequency || component.freq;
  component.threshold = threshold || component.threshold;
  component.board = board;
  component.io = board;
}

function updateServo(component, data, board) {
  const { description, digitalPin, range, startAt, command } = data;
  component.custom.description = description || component.custom.description;
  component.pin = digitalPin || component.pin;
  component.startAt = startAt || component.startAt;
  component.range[0] = range[0] || component.range[0];
  component.range[1] = range[1] || component.range[1];
  component.custom.rotation = range[1] || component.custom.range;
  component.custom.command = command || component.custom.command;
  component.board = board;
  component.io = board;
}

function updateLedState(component, data) {
  const { isOn } = data;
  if(isOn) {
    component.on();
  }
  else {
    component.off();
  }
}

function updateServoState(component, data) {
  const { position } = data;
  if(position >= 0 && position <= 180) {
    component.to(position);
  }
}

function updateLedStateVoice(component, voiceCommand) {
  const [ on, off ] = component.custom.command.map(command => levenshteinDistance(command, voiceCommand));
  if(on < off) {
    component.on();
  }
  else {
    component.off();
  }
  return { id: component.id, isOn: component.isOn };
}

function updateServoStateVoice(component, voiceCommand) {
  const splitted = voiceCommand.split(' ');
  if(Array.isArray(splitted)) {
    const textDegree = splitted[splitted.length - 1] || '',
          parsedDegree = parseInt(textDegree);
    if(parsedDegree >= 0) {
      const { range } = component;
      if(parsedDegree >= range[0] && parsedDegree <= range[1]) {
        component.to(range);
        return { id: component.id, position: component.position };
      }
    }
  }
}

function filterLed(_component) {
  const { id, pin, board, custom, isOn } = _component,
        { description, type, command } = custom,
        idBoard = board.id;
  return { id, description, digitalPin: pin, type, isOn, idBoard, command };
}

function filterThermometer(_component) {
  const { id, pin, board, custom, celsius, fahrenheit } = _component,
        { description, type } = custom,
        idBoard = board.id;
  return { id, description, analogPin: pin, type, celsius, fahrenheit, idBoard };
}

function filterLight(_component) {
  const { id, pin, board, custom, value } = _component,
        { description, type } = custom,
        idBoard = board.id;
  return { id, description, analogPin: pin, type, pin, value, idBoard };
}

function filterMotion(_component) {
  const { id, pin, board, custom, isCalibrated, detectedMotion } = _component,
        { description, type } = custom,
        idBoard = board.id;
  return { id, description, digitalPin: pin, type, isCalibrated, detectedMotion, idBoard };
}

function filterSensor(_component) {
  const { id, pin, board, custom, value } = _component,
        { description, type } = custom,
        idBoard = board.id;
  return { id, description, analogPin: pin, type, value, idBoard };
}

function filterServo(_component) {
  const { id, pin, board, custom, position, startAt, range } = _component,
        { description, type } = custom,
        idBoard = board.id;
  return { id, description, digitalPin: pin, type, startAt, range, position, idBoard };
}

function filterComponentsByLevenshteinDistance(_Components, voiceCommand) {
  if(Array.isArray(_Components)) {
    return _Components.filter(component => {
      return component.custom.command
                      .some(command => {
                        return (1 - levenshteinDistance(command, voiceCommand) / command.length)  >= 0.75;
                      });
    });
  }
}

module.exports = {
  componentCreator,
  componentUpdater,
  componentStateUpdater,
  componentStateVoiceUpdater,
  componentsExtractor
};