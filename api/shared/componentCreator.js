const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo,
      registerListener = require('../shared/register');

function createComponent(io, data, boards) {
  let { type } = data;
  type = parseInt(type);
  switch (type) {
    case 1: { // LED
      const led = createLed(data, boards);
      return led;
    }
    case 2: { // THERMOMETHER
      const thermomether = createThermomether(data, boards);
      registerListener(io, thermomether);
      return thermomether;
    }
    case 3: { // LIGHT
      const light = createLight(data, boards);
      registerListener(io, light);
      return light;
    }
    case 4: { // MOTION
      const motion = createMotion(data, boards);
      registerListener(io, motion);
      return motion;
    }
    case 5: { // SENSOR
      const sensor = createSensor(data, boards);
      registerListener(io, sensor);
      return sensor;
    }
    case 6: { // SERVO
      const servo = createServo(data, boards);
      return servo;
    }
    default: {
      return false;
    }
  }
}

function createLed(data, boards) {
  const { _id, digitalPin, idBoard, type, description } = data;
  const board = getBoardById(boards, idBoard);
  console.log('component created!');
  return new Led({
    id: _id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createThermomether(data, boards) {
  const { _id, analogPin, frequency, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Thermometer({
    id: _id,
    pin: `A${analogPin}`,
    freq: frequency,
    controller: 'LM35',
    board,
    custom: { type: parseInt(type), description }
  });
}

function createLight(data, boards) {
  const { _id, analogPin, frequency, threshold, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Light({
    id: _id,
    pin: `A${analogPin}`,
    freq: frequency,
    controller: "DEFAULT",
    threshold,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createMotion(data, boards) {
  const { _id, digitalPin, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Motion({
    id: _id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createSensor(data, boards) {
  const { _id, analogPin, threshold, frequency, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Sensor({
    id: _id,
    pin: `A${analogPin}`,
    threshold,
    freq: frequency,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createServo(data, boards) {
  const { _id, digitalPin, range, idBoard, startAt, type, description, rotation } = data,
        board = getBoardById(boards, idBoard);
  return new Servo({
    id: _id,
    pin: digitalPin,
    startAt,
    range,
    board,
    custom: { type: parseInt(type), description, rotation }
  });
}

function getBoardById(boards, idBoard) {
  return Array.prototype.filter.call(boards, board => board.id === idBoard)[0];
}

module.exports = createComponent;
