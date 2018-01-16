const fs = require('fs');
const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const util = require('./util.js');

let toS = o=>JSON.stringify(o,null,2);

let Todo = require('./src/todo.js');

let registered_users = util.getAllRegisteredUsers();
let user_buffer = {};

let app = WebApp.create();

let header = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpg',
  js: 'application/javascript',
  pdf: 'application/pdf'
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = Object.keys(registered_users).find((u)=>{
    return registered_users[u].sessionid==sessionid;
  });
  if(sessionid && user){
    req.user = user;
  }
}

let handleRequest = function(statusCode,res,dataToWrite){
  res.statusCode = statusCode;
  res.write(dataToWrite);
  res.end();
}

let serveFile = function(req,res){
  let url = `./public${req.url}`;
  if(url.split('.').length<3){
    url+='.html';
  }
  if(fs.existsSync(url)){
    let data = fs.readFileSync(url);
    res.setHeader('Content-Type',util.getContentHeader(url,header));
    handleRequest(200,res,data);
    return;
  }
  handleRequest(404,res,'<h1>File Not Found!<h1>');
}

let serveTodo = function(req,res){
  let url = req.url;
  if(user_buffer.allTodos) {
    let userTodos = user_buffer.getMentionedTodo(url);
  }
}

let redirectLoggedInUserToHome = (req,res)=>{
  if(req.url=='/login' && req.user){
    res.redirect('/home');
  }
}

let redirectLoggedOutUserToLogin = (req,res)=>{
  let urls = ['/home','/create','/view','/logout','/getTodo','/viewTodo','/createTodo'];
  if(!req.user && req.urlIsOneOf(urls)){
    res.redirect('/login');
  }
}

app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);

app.get('/',(req,res)=>{
  res.redirect('/login');
});

app.post('/login',(req,res)=>{
  let user = registered_users[req.body.username];
  if(!user) {
    res.setHeader('Set-Cookie',`message=Wrong username or password; Max-Age=5`);
    res.redirect('/login');
    return;
  }
  user_buffer = user;
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
});

app.get('/login',(req,res)=>{
  let login = fs.readFileSync('./public/login.html','utf8');
  login = login.replace('message',req.cookies.message||'');
  res.setHeader('Content-type','text/html');
  res.write(login);
  res.end();
});

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',`sessionid=0; Max-Age=5`);
  delete req.user.sessionid;
  delete req.user.message;
  res.redirect('./login');
});

app.get('/getTodo',(req,res)=>{
  res.write(JSON.stringify(user_buffer));
  res.end();
});

app.post('/createTodo',(req,res)=>{
  let todo = new Todo(req.body.title,req.body.description);
  let items = req.body.todo;
  if(typeof(items)!='string'){
    items.forEach((todoItem)=>{
      todo.addItem(todoItem);
    })
  }else{
    todo.addItem(items);
  }
  user_buffer.addTodo(todo);
  registered_users[user_buffer.getUsername()]=user_buffer;
  util.saveDatabase(registered_users);
  res.redirect('/home');
});

app.get('/viewTodo',(req,res)=>{
  let todo = fs.readFileSync(current_file);
  res.write(todo);
  res.end();
});

app.postProcess(serveTodo);
app.postProcess(serveFile);

module.exports = app;
