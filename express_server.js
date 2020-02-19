const express = require("express");
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
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

app.get("/hello", (req, res) =>{
  res.send("<html><body> Hello <b>HOMIES</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls : urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
/* app.post("/urls/new", (req, res) =>{
  console.log(req.params);
  console.log(req.params.body)
})
 */

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[shortURL] };
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
  console.log('shortURL:', shortURL);
  console.log('longURL:', req.body.longURL);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`)
});

