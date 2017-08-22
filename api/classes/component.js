const five = require('johnny-five'),
      boards = require('../collections/board').boards,
      Led = five.Led,
      Thermometer = five.Thermometer,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo;

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

module.exports = {
  createLed,
  createThermomether,
  createMotion,
  createSensor,
  createServo
};
