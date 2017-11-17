const mongoose = require('mongoose'),
      ObjectId = mongoose.Types.ObjectId;

function checkRedundantUserId(_Users, idUser) {
  return _Users.filter(user => user === idUser).length > 1;
}

function checkUserId(_Users, idUser) {
  return _Users.lastIndexOf(idUser);
}

function removeUserIdFromStore(_Users, idUser) {
  const index = checkUserId(_Users, idUser);
  if(index >= 0) {
    _Users.splice(index, 1);
  }
  return true;
}

function storeUserId(_Users, idUser) {
  if(ObjectId.isValid(idUser)) {
    _Users.push(idUser);
    return true;
  }
  else {
    return false;
  }
}



module.exports = {
  checkRedundantUserId,
  checkUserId,
  removeUserIdFromStore,
  storeUserId
}