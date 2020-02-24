//should be renamed to random number generator
function generateRandomString() {
  let randomString = '';
  for (let i = 0; i <= 6; i++) {
    randomString += Math.round(Math.random() * 10);
  }
  return randomString;
}

const getUserByEmail = function(key, database) {
  for (let userID in database) {
    if (database[userID].email === key) {
      let account = database[userID];
      return account;
    }
  }
  return false;
};

function urlsForUser(id, database) {
  let urlsdatabase = {};
  for (let urls in database) {
    if (database[urls].userID === id) {
      urlsdatabase[urls] = database[urls];
    }
  }
  return urlsdatabase;
}

module.exports = { generateRandomString, getUserByEmail, urlsForUser };
