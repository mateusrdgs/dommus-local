const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo,
      registerListener = require('../shared/register');

function createComponent(socket, data, boards) {
  const { type } = data;
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
  const { _id, digitalPin, idBoard } = data;
  const board = getBoardById(boards, idBoard);
  return new Led({
    id: _id,
    pin: digitalPin,
    board
  });
}

function createThermomether(data, boards) {
  const { _id, controller, analogPin, freq, idBoard } = data,
        board = getBoardById(boards, idBoard);
  return new Thermometer({
    id: _id,
    controller,
    pin: analogPin,
    freq,
    board
  });
}

function createMotion(data, boards) {
  const { _id, controller, analogPin, idBoard } = data,
        board = getBoardById(boards, idBoard);
  return new Motion({
    id: _id,
    controller,
    pin: analogPin,
    board
  });
}

function createSensor(data, boards) {
  const { _id, controller, analogPin, threshold, freq, idBoard } = data,
        board = getBoardById(boards, idBoard);
  return new Sensor({
    id: _id,
    pin: analogPin,
    controller,
    threshold,
    freq,
    board
  });
}

function createServo(data, boards) {
  const { _id, digitalPin, minRange, maxRange, idBoard } = data,
        startAt = 0,
        range = [minRange, maxRange],
        board = getBoardById(boards, idBoard);
  return new Servo({
    id: _id,
    pin: digitalPin,
    startAt,
    range,
    board
  });
}

function getBoardById(boards, idBoard) {
  return Array.prototype.filter.call(boards, board => board.id === idBoard)[0];
}

module.exports = createComponent;
