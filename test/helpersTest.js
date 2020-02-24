const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail('user@example.com', testUsers);
    const expectedOutput = 'userRandomID';
    assert.deepEqual(user.id, expectedOutput);
  });

  it('should return undefined with an invaild email', function() {
    const user = getUserByEmail('superswag420@trump.com', testUsers);
    const expected = undefined;
    assert.deepEqual(user.id, expected);
  });
});
