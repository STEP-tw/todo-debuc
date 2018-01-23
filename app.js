const app = require('./webapp.js').create();
const timeStamp = require('./time.js').timeStamp;
const util = require('./util.js');

let toS = o=>JSON.stringify(o,null,2);

let handleRequest = function(statusCode,res,dataToWrite){
  res.statusCode = statusCode;
  res.write(dataToWrite);
  res.end();
}

const logRequest = function(req,res){
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  app.fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}

const loadUser = function(req,res){
  let registered_users = app.userStore.getUsers();
  let sessionid = req.cookies.sessionid;
  let user = Object.keys(registered_users).find((u)=>{
    return registered_users[u].sessionid==sessionid;
  });
  if(sessionid && user){
    req.user = registered_users[user];
  }
}

const preventTemplatesPage = function(req,res){
  let urls=['/view.html','/home.html','/login.html','/create.html'];
  if(req.urlIsOneOf(urls)){
    handleRequest(404,res,'<h1>File Not Found!<h1>');
  }
}

const redirectLoggedInUserToHome = function(req,res){
  if(req.url=='/login' && req.user){
    res.redirect('/home');
  }
}

const redirectLoggedOutUserToLogin = function(req,res){
  let urls = ['/home','/create','/view','/logout','/getTodo','/viewTodo','/getAllTodo','/deleteTodo'];
  if(!req.user && req.urlIsOneOf(urls)){
    res.redirect('/login');
  }
}

const deleteCookie = function(req,res){
  let urls = ['/viewTodo','/view','/editTodo','/additem','/deleteitem','/mark','/unmark'];
  if(!req.urlIsOneOf(urls)){
    res.setHeader('Set-Cookie','currentTodo=-1; Max-Age=0');
  }
}

const preventDirectViewpageAccess = function(req,res){
  if(!req.cookies.currentTodo && req.url=='/view'){
    res.redirect('/home');
  }
}

const landingPageHandler = function(req,res){
  return loginPageHandler(req,res);
}

const loginPageHandler = function(req,res){
  let login = app.fs.readFileSync('./public/login.html','utf8');
  login = login.replace('message',req.cookies.message||'');
  res.setHeader('Content-type','text/html');
  res.write(login);
  res.end();
}

const loginHandler = function(req,res){
  let registered_users = app.userStore.getUsers();
  let user = registered_users[req.body.username];
  if(!user) {
    res.setHeader('Set-Cookie',`message=Wrong username; Max-Age=5`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
}

const logoutHandler = function(req,res){
  res.setHeader('Set-Cookie',`sessionid=0; Max-Age=5`);
  delete req.user.sessionid;
  delete req.user.message;
  res.redirect('/login');
}

const todoRequestHandler = function(req,res){
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

const createTodoHandler = function(req,res){
  let todo = req.user.addTodo(req.body.title,req.body.description);
  addTodoItem(req,todo);
  res.redirect('/home');
}

const getTodo = (req)=>{
  let todoIndex = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoIndex);
  return todo;
}

const viewTodoHandler = function(req,res){
  let todo = getTodo(req);
  res.write(JSON.stringify(todo));
  res.end();
}

const deleteTodoHandler = function(req,res){
  let todoIndex = req.cookies.currentTodo;
  req.user.deleteTodo(todoIndex);
  res.redirect('/home');
}

let editTitle = function(req,res,todoIndex){
  let newTitle = req.body.title;
  req.user.updateTodoTitle(todoIndex,newTitle);
}

let editTodoDescription = function(req,res,todoIndex) {
  req.user.updateTodoDescription(todoIndex,req.body.description);
}

let editTodoItem = function(req,todo){
  let label = Object.keys(req.body)[0];
  let item = req.body[label];
  let id = label.match(/[0-9]+/)[0];
  todo.updateItem(req.body[label],id);
}

const editTodoHandler = function(req,res){
  let todo = getTodo(req);
  let todoIndex = req.cookies.currentTodo;
  let fieldToEdit = Object.keys(req.body)[0];
  let action = {
    title: editTitle,
    description: editTodoDescription
  };
  if(fieldToEdit.includes('label')){
    editTodoItem(req,todo);
  }else{
    action[fieldToEdit](req,res,todoIndex);
  }
  res.redirect('/view');
}

const addItemHandler = function(req,res){
  let todo = getTodo(req);
  addTodoItem(req,todo);
  res.redirect('/view');
}

const deleteItemHandler = function(req,res){
  let todo = getTodo(req);
  todo.removeItem(req.body.id);
  res.redirect('/view');
}

const markStatusHandler = function(req,res){
  let todo = getTodo(req);
  todo.markItemAsDone(req.body.id);
  res.redirect('/view');
};

const unmarkStatusHandler = function(req,res){
  let todo = getTodo(req);
  todo.markItemAsUndone(req.body.id);
  res.redirect('/view');
};

const redirectAccordingValidTodo = (req,res,todoIndex)=>{
  if(req.user.getMentionedTodo(todoIndex)){
    res.setHeader('Set-Cookie',`currentTodo=${todoIndex}`);
    res.redirect('/view');
  }else{
    res.redirect('/home');
  }
}

const saveDatabase = function(req,res){
  util.saveDatabase(app.fs,app.userStore.getUsers(),app.userStore.path);
}

const serveTodo = function(req,res){
  let url = req.url;
  if(url.split('-').shift()=='/todo' && req.user){
    let todoIndex = url.split('-').pop();
    redirectAccordingValidTodo(req,res,todoIndex);
  }
}

const serveStatic = function(req,res){
  let url = `./public${req.url}`;
  if(url.split('.').length<3){
    url+='.html';
  }
  if(app.fs.existsSync(url)){
    let data = app.fs.readFileSync(url);
    res.setHeader('Content-Type',util.getContentHeader(url));
    handleRequest(200,res,data);
    return;
  }
  handleRequest(404,res,'<h1>File Not Found!<h1>');
}


app.use(logRequest);
app.use(loadUser);
app.use(preventTemplatesPage);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.use(deleteCookie);
app.use(preventDirectViewpageAccess);
app.get('/',landingPageHandler);
app.get('/login',loginPageHandler);
app.post('/login',loginHandler);
app.get('/logout',logoutHandler);
app.get('/getAllTodo',todoRequestHandler);
app.post('/create',createTodoHandler);
app.get('/viewTodo',viewTodoHandler);
app.get('/deleteTodo',deleteTodoHandler);
app.post('/editTodo',editTodoHandler);
app.post('/additem',addItemHandler);
app.post('/deleteitem',deleteItemHandler);
app.post('/mark',markStatusHandler);
app.post('/unmark',unmarkStatusHandler);
app.postProcess(saveDatabase);
app.postProcess(serveTodo);
app.postProcess(serveStatic);

module.exports = app;
