function registerListener(socket, component) {
  component.on('data', function() {
    socket.emit('changed:Component', this);
  });
}

module.exports = registerListener;