const fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const util = require('./util.js');
let User = require('./src/user.js');
process.env.DATA_STORE = './data/registeredUsers.json';

let lib = {};

let toS = o=>JSON.stringify(o,null,2);
let registered_users = util.getAllRegisteredUsers(process.env.DATA_STORE);

let handleRequest = function(statusCode,res,dataToWrite){
  res.statusCode = statusCode;
  res.write(dataToWrite);
  res.end();
}

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
    req.user = registered_users[user];
  }
}

lib.redirectLoggedInUserToHome = (req,res)=>{
  if(req.url=='/login' && req.user){
    res.redirect('/home');
  }
}

lib.redirectLoggedOutUserToLogin = (req,res)=>{
  let urls = ['/home','/create','/view','/logout','/getTodo','/viewTodo','/getAllTodo','/deleteTodo'];
  if(!req.user && req.urlIsOneOf(urls)){
    res.redirect('/login');
  }
}

lib.deleteCookie = (req,res)=>{
  let urls = ['/viewTodo','/view','/editTodo','/additem','/mark','/unmark'];
  if(!req.urlIsOneOf(urls)){
    res.setHeader('Set-Cookie','currentTodo=0; Max-Age=0');
  }
}

lib.preventDirectViewpageAccess = (req,res)=>{
  if(!req.cookies.currentTodo && req.url=='/view'){
    res.redirect('/home');
  }
}

lib.landingPageHandler = (req,res)=>{
  return lib.loginPageHandler(req,res);
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
  let allTodos = req.user.allTodos;
  res.write(JSON.stringify(allTodos));
  res.end();
}

const addTodoItem = (req,todo) => {
  let items = req.body.items||[];
  if(typeof(items)!='string'){
    items.forEach((todoItem)=>{
      todo.addItem(todoItem);
    });
  }else{
    todo.addItem(items);
  }
}

lib.createTodoHandler = (req,res)=>{
  let todo = req.user.addTodo(req.body.title,req.body.description);
  addTodoItem(req,todo);
  util.saveDatabase(registered_users,process.env.DATA_STORE);
  res.redirect('/home');
}

lib.viewTodoHandler = (req,res)=>{
  let todoTitle = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoTitle);
  res.write(JSON.stringify(todo));
  res.end();
}

lib.deleteTodoHandler = (req,res)=>{
  let todoTitle = req.cookies.currentTodo;
  req.user.deleteTodo(todoTitle);
  util.saveDatabase(registered_users,process.env.DATA_STORE);
  res.redirect('/home');
}

let editTitle = function(req,res,todoTitle){
  let newTitle = req.body.title;
  req.user.updateTodoTitle(todoTitle,newTitle);
  res.setHeader('Set-Cookie',`currentTodo=${newTitle}`);
}

let editTodoDescription = function(req,res,todoTitle) {
  req.user.updateTodoDescription(todoTitle,req.body.description);
}

let editTodoItem = function(req,todo){
  let label = Object.keys(req.body)[0];
  let item = req.body[label];
  let id = label.match(/[0-9]+/)[0];
  if(item){
    todo.updateItem(req.body[label],id);
  }else{
    todo.removeItem(id);
  }
}

lib.editTodoHandler = (req,res)=>{
  let todoTitle = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoTitle);
  let fieldToEdit = Object.keys(req.body)[0];
  let action = {
    title: editTitle,
    description: editTodoDescription
  };
  if(fieldToEdit.includes('label')){
    editTodoItem(req,todo);
  }else{
    action[fieldToEdit](req,res,todoTitle);
  }
  util.saveDatabase(registered_users,process.env.DATA_STORE);
  res.redirect('/view');
}

lib.addItemHandler=(req,res)=>{
  let todoTitle = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoTitle);
  addTodoItem(req,todo);
  util.saveDatabase(registered_users,process.env.DATA_STORE);
  res.redirect('/view');
}

lib.markStatusHandler = (req,res)=>{
  let todoTitle = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoTitle);
  todo.markItemAsDone(req.body.id);
  util.saveDatabase(registered_users,process.env.DATA_STORE);
};

lib.unmarkStatusHandler = (req,res)=>{
  let todoTitle = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoTitle);
  todo.markItemAsUndone(req.body.id);
  util.saveDatabase(registered_users,process.env.DATA_STORE);
};

const redirectAccordingValidTodo = (req,res,todoTitle)=>{
  if(req.user.getMentionedTodo(todoTitle)){
    res.setHeader('Set-Cookie',`currentTodo=${todoTitle}`);
    res.redirect('/view');
  }else{
    res.redirect('/home');
  }
}

lib.serveTodo = function(req,res){
  let url = req.url;
  if(url.split('-').shift()=='/todo' && req.user){
    let todoTitle = url.split('-').pop();
    todoTitle = decodeURI(todoTitle);
    redirectAccordingValidTodo(req,res,todoTitle);
  }
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
