class Task {

  constructor(id, date, value, component, status, milliseconds) {
    this.id = id;
    this.date = date;
    this.value = value;
    this.component = component;
    this.status = status;
    this.milliseconds = milliseconds;
  }
}

module.exports = Task;