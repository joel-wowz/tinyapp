const express = require('express');
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require(`cookie-parser`);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateRandomString() {
  let randomString = '';
  for (let i = 0; i <= 6; i++) {
    randomString += Math.round(Math.random() * 10);
  }
  return randomString;
}

const users = {
  '102830': {
    id: '102830',
    email: 'yeet@yeetmail.com',
    password: 'w0w',
  },
  test123: {
    id: 'test123',
    email: 'nice',
    password: 'lol',
  },
};
function checkID(key) {
  for (let userID in users) {
    if (users[userID].email === key) {
      let account = users[userID];
      return account;
    }
  }
  return false;
}

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/urls', (req, res) => {
  let templateVars = { user: req.cookies['user_id'], urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    user: req.cookies['user_id'],
  };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  const templateVars = {
    user: req.cookies['user_id'],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  //THIS IS TO SHORTEN THE STRING TO A RANDOM STRING
  let shortURL = generateRandomString();
  // url database makes a short url to the key of long url
  urlDatabase[shortURL] = req.body['longURL'];
  // redirect to short url link
  res.redirect(`/urls/${urlDatabase[shortURL]}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase['shortURL'];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post('/login', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let emailCheck = checkID(email);
  console.log(`email in /login:`, email);
  console.log(`password in /login:`, password);
  let templateVars = {
    user: req.cookies['user_id'],
  };
  // let user = checkID(email);
  if (!emailCheck) {
    res.status(403).send('no email associated here m8');
  }
  if (password === emailCheck.password) {
    res.cookie('user_id', emailCheck.id);
    res.redirect('/urls');
  } else {
    res.status(403).send("Don't hack me bro, incorrect password");
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie([ 'user_id' ]);
  res.redirect(`/urls`);
});

app.get('/register', (req, res) => {
  res.render(`register`);
});
app.post('/register', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let userID = generateRandomString();
  let emailCheck = checkID(email);
  if (!email || !password) {
    res.status(400).send('fillout the password and email and user');
  }

  if (emailCheck) {
    res.status(400).send('theres already an account linked to this email');
    res.redirect(`/register`);
  }

  users[userID] = {
    id: userID,
    email: email,
    password: password,
  };
  console.log(users);
  res.cookie('user_id', userID);
  res.redirect(`/urls`);
});

app.get('/login', (req, res) => {
  res.render(`login`);
});
