const express = require('express');
const cookieParser = require('cookie-parser');
const timeStamp = require('./time.js').timeStamp;
const homeRouter = require('./routers/homeRouter.js');

let toS = o => JSON.stringify(o, null, 2);

const app = express();

const logRequest = function(req, res, next) {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''
  ].join('\n');
  app.fs.appendFile('request.log', text,()=>{});
  console.log(`${req.method} ${req.url}`);
  next();
}

const loadUser = function(req, res, next) {
  let registered_users = app.userStore.getUsers();
  let sessionid = req.cookies.sessionid;
  let user = Object.keys(registered_users).find((u) => {
    return registered_users[u].sessionid == sessionid;
  });
  if (sessionid && user) {
    req.user = registered_users[user];
  }
  next();
}

const redirectLoggedInUserToHome = function(req, res, next) {
  if (req.user && req.url=='/login') {
    res.redirect('/home');
    return;
  }
  next();
}

const injectDependencies = function(req, res, next) {
  homeRouter.fs = app.fs;
  homeRouter.userStore = app.userStore;
  next();
}

let serveLogin = function(req,res){
  let login = app.fs.readFileSync('./public/login.html', 'utf8');
  console.log(req.cookies);
  login = login.replace('message', req.cookies.message || '');
  res.send(login);
}

let handleLogin = function(req,res){
  let registered_users = app.userStore.getUsers();
  let user = registered_users[req.body.username];
  if (!user) {
    res.cookie('message', 'Wrong username',{
      maxAge: 5000
    });
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.cookie('sessionid', sessionid);
  user.sessionid = sessionid;
  res.redirect('/home');
}

let handleLogout = function(req,res){
  res.cookie('sessionid', 0, {
    maxAge: 5
  });
  delete req.user;
  res.redirect('/login');
}

app.use(express.urlencoded({
  extended: true,
  type: req => true
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(logRequest);
app.use(loadUser);
app.use(injectDependencies);
app.get('/',serveLogin);
app.route('/login')
  .all(redirectLoggedInUserToHome)
  .get(serveLogin)
  .post(handleLogin);
app.use('/home',homeRouter);
app.get('/logout', handleLogout);

module.exports = app;
