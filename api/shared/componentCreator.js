const five = require('johnny-five'),
      boards = require('../collections/board'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo,
      registerListener = require('../shared/register');

function createComponent(socket, data) {
  const { type } = data;
  switch (type) {
    case 1: { // LED
      return createLed(data);
    }
    case 2: { // THERMOMETHER
      const thermomether = createThermomether(data);
      registerListener(socket, thermomether);
      return thermomether;
    }
    case 3: { // MOTION
      const motion = createMotion(data);
      registerListener(socket, motion);
      return motion;
    }
    case 4: { // SENSOR
      const sensor = createSensor(data);
      registerListener(socket, sensor);
      return sensor;
    }
    case 5: { // SERVO
      return createServo(data);
    }
    default: {
      return false;
    }
  }
}

function createLed(id, pin, idBoard) {
  const board = getBoardById(boards, idBoard);
  return new Led({
    id,
    pin,
    board
  });
}

function createThermomether(id, controller, pin, freq) {
  return new Thermometer({
    id,
    controller,
    pin,
    freq
  });
}

function createMotion(id, controller, pin) {
  return new Motion({
    id,
    controller,
    pin
  });
}

function createSensor(id, pin, threshold, freq) {
  return new Sensor({
    id,
    pin,
    threshold,
    freq
  });
}

function createServo(id, pin, minRange, maxRange) {
  const startAt = 0,
        range = [minRange, maxRange];
  return new Servo({
    id,
    pin,
    range,
    startAt
  })
}

function getBoardById(boards, idBoard) {
  return Array.prototype.filter.call(boards, board => board.id === idBoard)[0];
}

module.exports = createComponent;
