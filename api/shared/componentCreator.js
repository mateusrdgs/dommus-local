const five = require('johnny-five'),
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo,
      registerListener = require('../shared/register');

function createComponent(io, socket, data, board) {
  let { type } = data;
  type = parseInt(type);
  switch (type) {
    case 1: { // LED
      const led = createLed(data, board);
      registerListener(io, socket, led);
      console.log('Led created!');
      return led;
    }
    case 2: { // THERMOMETER
      const thermometer = createThermometer(data, board);
      registerListener(io, socket, thermometer);
      console.log('Thermometer created!');
      return thermometer;
    }
    case 3: { // LIGHT
      const light = createLight(data, board);
      registerListener(io, socket, light);
      console.log('Light created!');
      return light;
    }
    case 4: { // MOTION
      const motion = createMotion(data, board);
      registerListener(io, socket, motion);
      console.log('Motion created!');
      return motion;
    }
    case 5: { // SENSOR
      const sensor = createSensor(data, board);
      registerListener(io, socket, sensor);
      console.log('Sensor created!');
      return sensor;
    }
    case 6: { // SERVO
      const servo = createServo(data, board);
      registerListener(io, socket, servo);
      console.log('Servo created!');
      return servo;
    }
    default: {
      return false;
    }
  }
}

function createLed(data, board) {
  const { id, _id, digitalPin, type, description } = data;
  return new Led({
    id: id || _id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createThermometer(data, board) {
  const { id, _id, analogPin, frequency, type, description } = data;
  return new Thermometer({
    id: id ||_id,
    pin: `A${analogPin}`,
    freq: frequency,
    controller: 'LM35',
    board,
    custom: { type: parseInt(type), description }
  });
}

function createLight(data, board) {
  const { id, _id, analogPin, frequency, threshold, type, description } = data;
  return new Light({
    id: id || _id,
    pin: `A${analogPin}`,
    freq: frequency,
    controller: "DEFAULT",
    threshold,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createMotion(data, board) {
  const { id, _id, digitalPin, type, description } = data;
  return new Motion({
    id: id || _id,
    pin: digitalPin,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createSensor(data, board) {
  const { id, _id, analogPin, threshold, frequency, type, description } = data;
  return new Sensor({
    id: id || _id,
    pin: `A${analogPin}`,
    threshold,
    freq: frequency,
    board,
    custom: { type: parseInt(type), description }
  });
}

function createServo(data, board) {
  const { id, _id, digitalPin, range, startAt, type, description, rotation } = data;
  return new Servo({
    id: id || _id,
    pin: digitalPin,
    startAt,
    range,
    board,
    custom: { type: parseInt(type), description, rotation }
  });
}

module.exports = createComponent;
