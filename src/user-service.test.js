// @flow

const got = require('got');

import type {UserType} from './types';

const URL_PREFIX = 'http://localhost:3001/user';

describe('user-service', () => {
  beforeEach(async () => {
    // Delete all users.
    await got.delete(URL_PREFIX);
  });

  const USERNAME = 'Joe';
  const PASSWORD = 'Boxer';

  async function createUser(username, password) {
    const user: UserType = {username, password};
    const options = {body: user, json: true};
    const res = await got.post(URL_PREFIX, options);
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBe(URL_PREFIX + '/' + username);
  }

  async function getUser(username, password) {
    const options = {json: true};
    const res = await got.get(URL_PREFIX + '/' + username, options);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(username);
    expect(res.body.password).toBe(password);
  }

  test('should create a user', async done => {
    await createUser(USERNAME, PASSWORD);
    await getUser(USERNAME, PASSWORD);
    done();
  });

  test('should update a user', async done => {
    const newPassword = 'Cool';

    await createUser(USERNAME, PASSWORD);

    const user: UserType = {username: USERNAME, password: newPassword};
    const options = {body: user, json: true};
    const res = await got.put(URL_PREFIX, options);
    expect(res.statusCode).toBe(200);

    await getUser(USERNAME, newPassword);

    done();
  });

  test('should delete a user', async done => {
    try {
      await createUser(USERNAME, PASSWORD);
      let res = await got.delete(URL_PREFIX + '/' + USERNAME);
      expect(res.statusCode).toBe(200);
      res = await got.get(URL_PREFIX + '/' + USERNAME);
      done.fail('expected 404, but got ' + res.statusCode);
    } catch (e) {
      expect(e.statusCode).toBe(404);
      done();
    }
  });

  test('should return 404 when getting unknown user', async done => {
    try {
      const res = await got.get(URL_PREFIX + '/unknown');
      done.fail('expected 404, but got ' + res.statusCode);
    } catch (e) {
      expect(e.statusCode).toBe(404);
      done();
    }
  });

  test('should return 404 when deleting unknown user', async done => {
    try {
      const res = await got.delete(URL_PREFIX + '/unknown');
      done.fail('expected 404, but got ' + res.statusCode);
    } catch (e) {
      expect(e.statusCode).toBe(404);
      done();
    }
  });
});
