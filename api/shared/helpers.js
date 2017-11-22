const fs = require('fs'),
      BSON = require('bson'),
      bson = new BSON();

function addItemToCollection(collection, item) {
  collection.push(item);
}

function areArraysSameLength() {
  return Array.from(arguments)
              .map(extArr => extArr.length)
              .reduce((prev, next) => prev.length === next.length);
}

function checkExistentFile(fileName) {
  return fs.existsSync(fileName);
}

function checkIfIsObject(property) {
  return typeof property === 'object';
}

function extractValues(object) {
  return Object.keys(object).map(key => object[key]);
}

function filterItemFromCollectionByProperty(collection, property, propertyValue) {
  return collection.filter(item => item[property] === propertyValue)[0];
}

function flatArray(arr, prevArr) {
  return [...arr, ...prevArr];
}

function transformObjectIntoArray(target, values, index) {
  if(Array.isArray(values) && index >= values.length) {
    return values;
  }
  else {
    if(!values) {
      return transformObjectIntoArray(target, extractValues(target), 0);
    }
    else {
      if(checkIfIsObject(values[index])) {
        const extractedValues = extractValues(values[index]);
        return transformObjectIntoArray(
          target,
          flatArray(
            returnTargetSplice(values, index, 1),
            extractedValues
          ),
          index
        );
      }
      else {
        return transformObjectIntoArray(target, values, ++index);
      }
    }
  }
}

function readDataFromBSONFile(fileName) {
  try {
    const data = fs.readFileSync(fileName);
    const t = bson.deserialize(data);
    return t;
  }
  catch(exception) {
    console.error(exception);
    return false;
  }
}

function returnTargetSplice(target, index, quantity) {
  target.splice(index, quantity);
  return target;
}

function writeDataOnBSONFile(fileName, data) {
  try {
    fs.writeFileSync(fileName, bson.serialize(data));
    return true;
  }
  catch(exception) {
    console.log(exception);
    return false;
  }
}

module.exports = {
  addItemToCollection,
  areArraysSameLength,
  checkExistentFile,
  checkIfIsObject,
  extractValues,
  filterItemFromCollectionByProperty,
  flatArray,
  transformObjectIntoArray,
  readDataFromBSONFile,
  writeDataOnBSONFile
}