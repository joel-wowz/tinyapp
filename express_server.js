const express = require('express');
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require(`cookie-parser`);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/// -------------------------- FUNCTIONS --------------------///
function generateRandomString() {
  let randomString = '';
  for (let i = 0; i <= 6; i++) {
    randomString += Math.round(Math.random() * 10);
  }
  return randomString;
}

function checkID(key) {
  for (let userID in users) {
    if (users[userID].email === key) {
      let account = users[userID];
      return account;
    }
  }
  return false;
}

function urlsForUser(id) {
  let urlsUsers = {};
  for (let urls in urlDatabase) {
    if (urlDatabase[urls].userID === id) {
      urlsUsers[urls] = urlDatabase[urls].longURL;
    }
  }
  return urlsUsers;
}
/// ----- ----- ------ CONST USERS/DATABASE -------------------///
const users = {
  '102830': {
    id: '102830',
    email: 'yeet@yeetmail.com',
    password: 'w0w',
  },
  test1235: {
    id: 'test123',
    email: 'nice@nice.com',
    password: 'lol',
  },
};

const urlDatabase = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
};

/// ------------------ GET REQUESTS --------------------------///
app.get('/test', (req, res) => {
  res.send('test');
  console.log(urlsForUser('aJ48lW'));
});
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  let user = users[req.cookies.user_id];
  if (!user) {
    res.redirect(`/login`);
  } else {
    let templateVars = { user: user.id, urls: urlDatabase };
    res.render('urls_index', templateVars);
  }
});

app.get('/urls/new', (req, res) => {
  let user = users[req.cookies.user_id];
  let templateVars = {
    user: user,
  };
  if (!user) {
    res.redirect(`/login`);
  }
  res.render('urls_new', templateVars);
});

app.get('/login', (req, res) => {
  let templateVars = { username: '' };
  res.render(`login`, templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let userID = req.cookies.user_id;
  let user = users[userID];
  console.log(`req testing in shortURL`, urlDatabase);
  const templateVars = {
    user: user,
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  //console.log(`/u/:shortURL test`, req.params.shortURL);
});

app.get('/register', (req, res) => {
  let templateVars = { username: '' };
  res.render(`register`, templateVars);
});

/// ------------------------------POST-------------------------------------POST-----------\\\
app.post('/urls/new', (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let userID = req.cookies.user_id;
  console.log('longURL IN post new', userID);
  urlDatabase[shortURL] = { longURL: longURL, userID: userID };
  res.redirect(`/urls`);
});

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  /*   console.log(`reqbody:`, req.body, `req.cookies.user_id:`, req.cookies.user_id); */
  let entry = { longURL: req.body.longURL, userID: req.cookies.user_id };
  console.log(`entry check:`, entry);
  /*   console.log(`newEntry:`, entry);
  console.log(`urls database post`, urlDatabase); */
  urlDatabase[shortURL] = entry;

  res.redirect(`/urls/${urlDatabase['shortURL']}`);
});

app.post(`/urls/:shortURL`, (req, res) => {
  let newLongURL = req.body.newLongURL;
  console.log(`newlongurl test:`, newLongURL);
  // console.log(`newlongurltest:`, newLongURL);
  let shortURL = req.params.shortURL;
  // console.log(`shortURL TEST:`, shortURL);
  //urlDatabase[shortURL] = newLongUrl;
  // res.redirect(`/urls`);
  res.redirect(`/urls`);
  console.log(`urlDatabase check after posting a newshort url`, urlDatabase);
});
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post('/login', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let emailCheck = checkID(email);
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

  res.cookie('user_id', userID);
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`whats up listening @ ${PORT}!`);
});
