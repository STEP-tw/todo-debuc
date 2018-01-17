const fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const util = require('./util.js');
let Todo = require('./src/todo.js');
process.env.DATA_STORE = './data/registeredUsers.json';

let lib = {};

let toS = o=>JSON.stringify(o,null,2);
let registered_users = util.getAllRegisteredUsers();
let user_buffer = {};
let current_todo = {};

lib.logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}

lib.loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = Object.keys(registered_users).find((u)=>{
    return registered_users[u].sessionid==sessionid;
  });
  if(sessionid && user){
    req.user = user;
  }
}

lib.redirectLoggedInUserToHome = (req,res)=>{
  if(req.url=='/login' && req.user){
    res.redirect('/home');
  }
}

lib.redirectLoggedOutUserToLogin = (req,res)=>{
  let urls = ['/home','/create','/view','/logout','/getTodo','/viewTodo'];
  if(!req.user && req.urlIsOneOf(urls)){
    res.redirect('/login');
  }
}

lib.landingPageHandler = (req,res)=>{
  res.redirect('/login');
}

lib.loginPageHandler = (req,res)=>{
  let login = fs.readFileSync('./public/login.html','utf8');
  login = login.replace('message',req.cookies.message||'');
  res.setHeader('Content-type','text/html');
  res.write(login);
  res.end();
}

lib.loginHandler = (req,res)=>{
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
}

lib.logoutHandler = (req,res)=>{
  res.setHeader('Set-Cookie',`sessionid=0; Max-Age=5`);
  delete req.user.sessionid;
  delete req.user.message;
  res.redirect('/login');
}

lib.todoRequestHandler = (req,res)=>{
  res.write(JSON.stringify(user_buffer));
  res.end();
}

lib.createTodoHandler = (req,res)=>{
  let todo = new Todo(req.body.title,req.body.description);
  let items = req.body.todo;
  if(typeof(items)!='string'){
    items.forEach((todoItem)=>{
      todo.addItem(todoItem);
    });
  }else{
    todo.addItem(items);
  }
  user_buffer.addTodo(todo);
  registered_users[user_buffer.getUsername()]=user_buffer;
  util.saveDatabase(registered_users,process.env.DATA_STORE);
  res.redirect('/home');
}

lib.viewTodoHandler = (req,res)=>{
  res.write(JSON.stringify(current_todo));
  res.end();
}

lib.serveTodo = function(req,res){
  let url = req.url;
  if(url.split('-').shift()=='/todo' && req.user){
    current_todo = user_buffer.getMentionedTodo(url.split('-').pop());
    if(current_todo) res.redirect('/view');
  }
}

let handleRequest = function(statusCode,res,dataToWrite){
  res.statusCode = statusCode;
  res.write(dataToWrite);
  res.end();
}

lib.serveStatic = function(req,res){
  let url = `./public${req.url}`;
  if(url.split('.').length<3){
    url+='.html';
  }
  if(fs.existsSync(url)){
    let data = fs.readFileSync(url);
    res.setHeader('Content-Type',util.getContentHeader(url));
    handleRequest(200,res,data);
    return;
  }
  handleRequest(404,res,'<h1>File Not Found!<h1>');
}

module.exports = lib;
