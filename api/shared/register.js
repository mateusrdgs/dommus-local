const five = require('johnny-five'),
      Fn = five.Fn,
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Motion = five.Motion,
      Sensor = five.Sensor,
      Servo = five.Servo;

function registerListener(io, component) {
  switch(component.constructor) {
    case Led: {
      break;
    }
    case Motion: {
      registerMotionListener(io, component);
      break;
    }
    case Servo: {
      break;
    }
    default: {
      registerDataListener(io, component);
      break;
    }
  }
}

function registerDataListener(io, component) {
  component.on('data', function() {
    switch(this.constructor) {
      case Thermometer: {
        const { id, celsius, fahrenheit } = this;
        io.emit(`data:${id}`, { id, celsius, fahrenheit });
      }
        break;
      case Light:
      case Sensor: {
        const { id, value } = this;
        const newLevel = Fn.map(value, 0, 1023, 100, 0);
        io.emit(`data:${id}`, { id, value: newLevel });
      }
        break;
    }
  });
};

function registerMotionListener(io, component) {
  component.on('motionstart', function() {
    const { id, detectedMotion } = this;
    io.emit(`motion:${id}`, { id, detectedMotion });
  });
  component.on('motionend', function() {
    const { id, detectedMotion } = this;
    io.emit(`motion:${id}`, { id, detectedMotion });
  })
}

module.exports = registerListener;