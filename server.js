const http = require('http');
const fs = require('fs');
const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const util = require('./util.js');
const PORT = 9900;

let toS = o=>JSON.stringify(o,null,2);

let registered_users = util.getAllRegisteredUsers();

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
};

let handleRequest = function(statusCode,res,dataToWrite){
  res.statusCode = statusCode;
  res.write(dataToWrite);
  res.end();
}

let serveFile = function(req,res){
  let url = './public'+req.url;
  if(fs.existsSync(url)){
    let data = fs.readFileSync(url);
    res.setHeader('Content-Type',util.getContentHeader(url,header));
    handleRequest(200,res,data);
    return;
  }
  handleRequest(404,res,'<h1>File Not Found!<h1>');
}

let redirectLoggedInUserToHome = (req,res)=>{
  if(req.url=='/login' && req.user)
    res.redirect('/home.html');
}

app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);

app.get('/',(req,res)=>{
  res.redirect('./index.html');
});

app.post('/login',(req,res)=>{
  console.log(req.body);
  let user = registered_users.find(u=>{
    return u.userName==req.body.userName && u.password==req.body.password;
  });
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('./index.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  req.user_buffer = user;
  res.redirect('./home.html');
});

app.get('/index.html',(req,res)=>{
  let msg = '';
  let login = fs.readFileSync('./public/index.html','utf8');
  if(req.user) {
    res.redirect('./home.html');
    return;
  }
  login = login.replace('message',msg);
  res.setHeader('Content-type','text/html');
  res.write(login);
  res.end();
});

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`logInFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('./index.html');
});

app.postProcess(serveFile);

let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
