const component = require('../classes/component'),
      registerListener = require('../shared/register');

function createComponent(socket, data) {
  const { type } = data;
  switch (type) {
    case 1: { // LED
      return returnCreatedLed(data);
    }
    case 2: { // THERMOMETHER
      const thermomether = returnCreatedThermomether(data);
      registerListener(socket, thermomether);
      return thermomether;
    }
    case 3: { // MOTION
      const motion = returnCreatedMotion(data);
      registerListener(socket, motion);
      return motion;
    }
    case 4: { // SENSOR
      const sensor = returnCreatedSensor(data);
      registerListener(socket, sensor);
      return sensor;
    }
    case 5: { // SERVO
      return returnCreatedServo(data);
    }
    default: {
      return false;
    }
  }
}

function returnCreatedLed(data) {
  const { _id, idBoard, digitalPin, description } = data;
  return component.createLed(_id, digitalPin, idBoard);
}

function returnCreatedThermomether(data) {
  const { _id, description, controller, pin, freq } = data;
  return component.createThermomether(_id, controller, pin, freq);
}

function returnCreatedMotion(data) {
  const { _id, controller, pin } = data;
  return component.createMotion(_id, controller, pin)
}

function returnCreatedSensor(data) {
  const { _id, description, pin, threshold, freq } = data;
  return component.createSensor(_id, description, pin, threshold, freq);
}

function returnCreatedServo(data) {
  const { _id, description, pin, minRange, maxRange } = data;
  return component.createServo(_id, description, pin, minRange, maxRange);
}

module.exports = {
  createComponent
}
