const fs = require('fs');

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

function iterateOverObjectProperties(target, values, index) {
  if(Array.isArray(values) && index >= values.length) {
    return values;
  }
  else {
    if(!values) {
      return iterateOverObjectProperties(target, extractValues(target), 0);
    }
    else {
      if(checkIfIsObject(values[index])) {
        const extractedValues = extractValues(values[index]);
        return iterateOverObjectProperties(
          target,
          flatArray(
            returnTargetSplice(values, index, 1),
            extractedValues
          ),
          index
        );
      }
      else {
        return iterateOverObjectProperties(target, values, ++index);
      }
    }
  }
}

function readDataFromJSONFile(fileName) {
  return JSON.parse(fs.readFileSync(fileName));
}

function returnTargetSplice(target, index, quantity) {
  target.splice(index, quantity);
  return target;
}

function writeDataOnJSONFile(data) {
  try {
    fs.writeFileSync('residence.json', JSON.stringify(data));
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
  iterateOverObjectProperties,
  readDataFromJSONFile,
  writeDataOnJSONFile
}