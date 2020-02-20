const express = require("express");
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require(`cookie-parser`)
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
function generateRandomString() {
  let randomString = "";
  for (let i = 0; i <= 6; i++) {
    randomString += Math.round(Math.random() * 10);
  }
  return randomString;
}



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies["username"], urls : urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);

});

app.post("/urls", (req, res) => {
  //THIS IS TO SHORTEN THE STRING TO A RANDOM STRING
  let shortURL = generateRandomString();
  // url database maakes a short url to the key of long url
  urlDatabase[shortURL] = req.body['longURL']
  // redirect to short url link
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase['shortURL'];
  res.redirect(longURL);
});


app.post("/urls/:shortURL/delete", (req, res)=>{
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  let shortURL =  req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {

  const username = req.body.username
  res.cookie(`username`,username)
  res.redirect(`/urls`)
  let templateVars = {
    username: req.cookies["username"],
    
  };
  res.render("urls_index", templateVars)
});

app.post("/logout", (req, res) => {
  res.clearCookie(req.cookies["username"]);
  res.redirect(`/urls`)
});

