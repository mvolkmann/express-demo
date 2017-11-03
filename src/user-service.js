// @flow

type UserType = {
  username: string,
  password: string
};

type UserMapType = {[username: string]: UserType};

const users: UserMapType = {};

function deleteHandler(req: express$Request, res: express$Response) {
  const {username} = req.params;
  if (users[username]) {
    delete users[username];
    res.send();
  } else {
    res.status(404).send(`user ${username} not found`);
  }
}

function getAllHandler(req: express$Request, res: express$Response) {
  res.send(users);
}

function getHandler(req: express$Request, res: express$Response) {
  const {username} = req.params;
  const user = users[username];
  if (user) {
    res.send(user);
  } else {
    res.status(404).send(`user ${username} not found`);
  }
}

function getRequestUrl(req: express$Request) {
  const {hostname, path, protocol} = req;
  const {port} = req.socket.address();
  return `${protocol}://${hostname}:${port}${path}`;
}

function postHandler(req: express$Request, res: express$Response) {
  const newUser = req.body;
  const {username} = newUser;
  const user = users[username];
  if (user) {
    res.status(400).send(`user ${username} already exists`);
  } else {
    users[username] = newUser;
    res.set('Location', getRequestUrl(req) + '/' + username);
    res.status(201).send();
  }
}

function putHandler(req: express$Request, res: express$Response) {
  const modifiedUser = req.body;
  const {username} = modifiedUser;
  const user = users[username];
  if (user) {
    users[username] = modifiedUser;
    res.send();
  } else {
    res.status(404).send(`user ${username} not found`);
  }
}

module.exports = (app: express$Application) => {
  const URL_PREFIX = '/user';
  app.delete(URL_PREFIX + '/:username', deleteHandler);
  app.get(URL_PREFIX, getAllHandler);
  app.get(URL_PREFIX + '/:username', getHandler);
  app.post(URL_PREFIX, postHandler);
  app.put(URL_PREFIX, putHandler);
};
