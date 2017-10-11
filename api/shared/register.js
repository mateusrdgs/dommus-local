const five = require('johnny-five'),
      Fn = five.Fn,
      Led = five.Led,
      Thermometer = five.Thermometer,
      Light = five.Light,
      Sensor = five.Sensor,
      Servo = five.Servo;

function registerListener(io, socket, component) {
  const { type } = component.custom;
  switch(type) {
    case 1: {
      registerStateListener(io, socket, component);
      break;
    }
    case 4: {
      registerMotionListener(io, component);
      break;
    }
    case 6: {
      registerStateListener(io, socket, component);
      break;
    }
    default: {
      registerDataListener(io, component);
      break;
    }
  }
}

function registerStateListener(io, socket, component) {
  switch(component.constructor) {
    case Led: {
        socket.on(`state:${component.id}`, data => {
          const { isOn } = data;
          if(isOn) {
            component.off();
          }
          else {
            component.on();
          }
        });
      break;
    }
    case Servo: {
      socket.on(`state:${component.id}`, data => {
        const { position } = data;
        if(parseInt(position) >= 0 && position <= component.range[1]) {
          component.to(position);
        }
      });
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