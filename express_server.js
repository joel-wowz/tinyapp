const express = require('express');
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require('body-parser');
const cookieSession = require(`cookie-session`);
const bcrypt = require('bcrypt');
const { generateRandomString, getUserByEmail, urlsForUser } = require(`./helpers.js`);
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(
  cookieSession({
    name: 'session',
    keys: [ 'secret' ],
  }),
);

/// ----- ----- ------ CONST USERS/DATABASE -------------------///
const users = {};

const urlDatabase = {};

/// ------------------ GET REQUESTS --------------------------///

app.get('/urls', (req, res) => {
  let user = users[req.session.user_id];
  let shortURL = req.params.shortURL;
  if (!user) {
    res.redirect(`/login`);
  } else {
    let userURLS = urlsForUser(user.id, urlDatabase);
    let templateVars = {
      user: user.id,
      urls: userURLS,
    };
    res.render('urls_index', templateVars);
  }
});

app.get('/urls/new', (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {
    user: user,
  };
  if (!req.session.user_id) {
    res.redirect(`/login`);
  }
  res.render('urls_new', templateVars);
});

app.get('/login', (req, res) => {
  let templateVars = {
    username: '',
  };
  res.render(`login`, templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let userID = req.session.user_id;
  let user = users[userID];
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]['longURL'];
  const templateVars = {
    user: user,
    urls: urlDatabase,
    longURL: longURL,
    shortURL: shortURL,
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  let urlRedirect = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(urlRedirect);
});

app.get('/register', (req, res) => {
  let templateVars = {
    username: '',
  };
  res.render(`register`, templateVars);
});

/// ------------------------------POST-------------------------------------POST-----------\\\
app.post('/urls/new', (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let userID = req.session.user_id;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userID,
  };
  res.redirect(`/urls`);
});

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  let entry = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  urlDatabase[shortURL] = entry;
  res.redirect(`/urls/${urlDatabase['shortURL']}`);
});

app.post(`/urls/:shortURL`, (req, res) => {
  let userID = req.session.user_id;
  let user = users[userID];
  if (!user) {
    res.redirect('https://alwaysjudgeabookbyitscover.com/');
  } else {
    let newLongURL = req.body.newLongURL;
    let shortURL = req.params.shortURL;
    let oldURL = urlDatabase[shortURL];
    oldURL.longURL = newLongURL;
    res.redirect(`/urls`);
  }
});
app.post('/urls/:shortURL/delete', (req, res) => {
  let userID = req.session.user_id;
  let user = users[userID];
  if (!user) {
    res.redirect('https://puu.sh/FdP9D/8f30309f90.gif');
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  }
});

app.post('/login', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let emailCheck = getUserByEmail(email);
  if (!emailCheck) {
    res.status(403).send('no email associated here m8');
  }
  if (bcrypt.compareSync(password, emailCheck.password)) {
    req.session.user_id = emailCheck.id;
    res.redirect('/urls');
  } else {
    res.status(403).send("Don't hack me bro, incorrect password");
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

app.post('/register', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let hashedPassword = bcrypt.hashSync(password, 10);
  let userID = generateRandomString();
  let emailCheck = getUserByEmail(email);
  if (!email || !password) {
    res.status(400).send('fillout the password and email broski. No Fun Allowed.');
  }
  if (emailCheck) {
    res.status(400).send('theres already an account linked to this email');
    res.redirect(`/register`);
  }

  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword,
  };

  req.session.user_id = userID;
  res.redirect(`/urls`);
});
app.listen(PORT, () => {
  console.log(`whats up man, im listening @ ${PORT}!`);
});
