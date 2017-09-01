const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo,
      registerListener = require('../shared/register');

function createComponent(socket, data, boards) {
  let { type } = data;
  type = parseInt(type);
  switch (type) {
    case 1: { // LED
      return createLed(data, boards);
    }
    case 2: { // THERMOMETHER
      const thermomether = createThermomether(data, boards);
      registerListener(socket, thermomether);
      return thermomether;
    }
    case 3: { // MOTION
      const motion = createMotion(data, boards);
      registerListener(socket, motion);
      return motion;
    }
    case 4: { // SENSOR
      const sensor = createSensor(data, boards);
      registerListener(socket, sensor);
      return sensor;
    }
    case 5: { // SERVO
      return createServo(data, boards);
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
    custom: { type, description }
  });
}

function createThermomether(data, boards) {
  const { _id, controller, analogPin, frequency, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Thermometer({
    id: _id,
    controller,
    pin: analogPin,
    frequency,
    board,
    custom: { type, description }
  });
}

function createMotion(data, boards) {
  const { _id, controller, analogPin, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Motion({
    id: _id,
    controller,
    pin: analogPin,
    board,
    custom: { type, description }
  });
}

function createSensor(data, boards) {
  const { _id, controller, analogPin, threshold, frequency, idBoard, type, description } = data,
        board = getBoardById(boards, idBoard);
  return new Sensor({
    id: _id,
    pin: analogPin,
    controller,
    threshold,
    frequency,
    board,
    custom: { type, description }
  });
}

function createServo(data, boards) {
  const { _id, digitalPin, minRange, maxRange, idBoard, type, description } = data,
        startAt = 0,
        range = [minRange, maxRange],
        board = getBoardById(boards, idBoard);
  return new Servo({
    id: _id,
    pin: digitalPin,
    startAt,
    range,
    board,
    custom: { type, description }
  });
}

function getBoardById(boards, idBoard) {
  return Array.prototype.filter.call(boards, board => board.id === idBoard)[0];
}

module.exports = createComponent;
