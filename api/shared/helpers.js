function filterItemFromCollectionByProperty(collection, property, propertyValue) {
  return collection.filter(item => item[property] === propertyValue)[0];
}

function addItemToCollection(collection, item) {
  collection.push(item);
}

module.exports = {
  addItemToCollection,
  filterItemFromCollectionByProperty
}