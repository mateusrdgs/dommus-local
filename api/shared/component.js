const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Sensor = five.Sensor,
      Motion = five.Motion,
      Servo = five.Servo;

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
      updateLed(component, data, board);
      break;
    }
    case Thermometer: {
      break;
    }
    case Light: {
      break;
    }
    case Motion: {
      break;
    }
    case Sensor: {
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

function createLed(data, board) {
  const { id, digitalPin, type, description } = data;
  return new Led({
    id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description }
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
    threshold,
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
  const { id, digitalPin, range, startAt, type, description, rotation } = data;
  return new Servo({
    id,
    pin: digitalPin,
    startAt,
    range,
    board,
    custom: { type: parseInt(type), description, rotation }
  });
}

function updateLed(component, data, board) {
  const { description, digitalPin } = data;
  component.custom.description = description || component.custom.description;
  component.pin = digitalPin || component.pin;
  component.board = board;
  component.io = board;
}

function updateServo(component, data, board) {
  const { description, digitalPin, range, startAt } = data;
  component.custom.description = description || component.custom.description;
  component.pin = digitalPin || component.pin;
  component.startAt = startAt || component.startAt;
  component.range[0] = range[0] || component.range[0];
  component.range[1] = range[1] || component.range[1];
  component.custom.rotation = range[1] || component.custom.range;
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

function filterLed(_component) {
  const { id, pin, board, custom, isOn } = _component,
        { description, type } = custom,
        idBoard = board.id;
  return { id, description, digitalPin: pin, type, isOn, idBoard };
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

module.exports = {
  componentCreator,
  componentUpdater,
  componentStateUpdater,
  componentsExtractor
};