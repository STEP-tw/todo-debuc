const http = require('http');
const fs = require('fs');
const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const util = require('./util.js');
const PORT = 9000;

let toS = o=>JSON.stringify(o,null,2);

let registered_users = util.getAllRegisteredUsers();
let user_buffer = {};
let current_file = '';

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
  let user = registered_users.find(u=>u.sessionid==sessionid);
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
  let url = './public'+req.url;
  let path = `./data/userTodos/${user_buffer.userName}/${req.url}.json`;
  if(fs.existsSync(url)){
    let data = fs.readFileSync(url);
    res.setHeader('Content-Type',util.getContentHeader(url,header));
    handleRequest(200,res,data);
    return;
  }
  if(fs.existsSync(path)){
    current_file += path;
    res.redirect('/view.html');
    return;
  }
  handleRequest(404,res,'<h1>File Not Found!<h1>');
}

let redirectLoggedInUserToHome = (req,res)=>{
  if(req.url=='/index.html' && req.user){
    res.redirect('/home.html');
  }
}

// let redirectLoggedOutUserToLogin = (req,res)=>{
//   if(!req.user && !req.url.includes('index')){
//     res.redirect('/index.html');
//   }
// }

app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
// app.use(redirectLoggedOutUserToLogin);

app.get('/',(req,res)=>{
  res.redirect('/index.html');
});

app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>{
    return u.userName==req.body.userName && u.password==req.body.password;
  });
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/index.html');
    return;
  }
  user_buffer = user;
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',[`logInFailed=false`,`sessionid=${sessionid}`]);
  user.sessionid = sessionid;
  res.redirect('/home.html');
});

app.get('/index.html',(req,res)=>{
  let msg = '';
  let login = fs.readFileSync('./public/index.html','utf8');
  if(req.cookies.logInFailed) msg='Wrong username or password';
  login = login.replace('message',msg);
  res.setHeader('Content-type','text/html');
  res.write(login);
  res.end();
});

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`logInFailed=false; Max-Age=5`,`sessionid=0; MAx-Age=5`]);
  delete req.user.sessionid;
  delete req.user.logInFailed;
  res.redirect('./index.html');
});

app.get('/getTodo',(req,res)=>{
  res.write(JSON.stringify(user_buffer));
  res.end();
});

app.post('/createTodo',(req,res)=>{
  let todo = {};
  let oldData = JSON.stringify(user_buffer,null,2);
  let user = user_buffer.userName;
  let title = req.body.title;
  let fileLink = `./data/userTodos/${user}/${title}.json`
  if(!fs.existsSync(`./data/userTodos/${user}`)){
    fs.mkdirSync(`./data/userTodos/${user}`);
  }
  fs.writeFileSync(fileLink,JSON.stringify(req.body));
  todo.title = title;
  todo.fileLink = fileLink;
  user_buffer.todoLists.push(todo);
  util.saveDatabase(user,todo);
  res.redirect('/home.html');
});

app.get('/create.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/create.html'));
  res.end();
});

app.get('/home.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/home.html'));
  res.end();
});

app.get('/view.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/view.html'));
  res.end();
});

app.get('/viewTodo',(req,res)=>{
  let todo = fs.readFileSync(current_file);
  res.write(todo);
  res.end();
});

app.postProcess(serveFile);

let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
