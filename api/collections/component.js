const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo;


function createLed(id, pin) {
  return new Led({
    id,
    pin
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

module.exports = {
  createLed,
  createThermomether,
  createMotion,
  createSensor,
  createServo
};
