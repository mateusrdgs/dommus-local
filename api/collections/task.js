const { readDataFromBSONFile } = require('../shared/helpers'),
      deserializedTasks = readDataFromBSONFile('.tasks.bson'),
      _Tasks = Object.keys(deserializedTasks).map(key => {
        return deserializedTasks[parseInt(key)];
      }) || [];

module.exports = _Tasks;