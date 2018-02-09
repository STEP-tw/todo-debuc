const express = require('express');
const timeStamp = require('./time.js').timeStamp;
const cookieParser = require('cookie-parser');

let toS = o => JSON.stringify(o, null, 2);

const app = express();

let urlIsOneOf = function(urls) {
  return urls.includes(this.url);
}

// const logRequest = function(req, res, next) {
//   let text = ['------------------------------',
//     `${timeStamp()}`,
//     `${req.method} ${req.url}`,
//     `HEADERS=> ${toS(req.headers)}`,
//     `COOKIES=> ${toS(req.cookies)}`,
//     `BODY=> ${toS(req.body)}`, ''
//   ].join('\n');
//   app.fs.appendFile('request.log', text,()=>{});
//   console.log(`${req.method} ${req.url}`);
//   next();
// }

// const redirectLoggedInUserToHome = function(req, res, next) {
//   if (req.user) {
//     res.redirect('/home.html');
//   } else {
//     next();
//   }
// }

const deleteCookie = function(req, res, next) {
  let urls = ['/viewTodo', '/view.html', '/editTodo', '/additem', '/deleteitem', '/mark', '/unmark'];
  if (!urlIsOneOf.call(req, urls)) {
    res.cookie('currentTodo', 1, {
      maxAge: 0
    });
  }
  next();
}

// const landingPageHandler = function(req, res) {
//   console.log('=======>inside landingPageHandler');
//   let login = app.fs.readFileSync('./public/login.html', 'utf8');
//   login = login.replace('message', req.cookies.message || '');
//   res.send(login);
// }

// const loginPageHandler = function(req, res) {
//   console.log('=======>inside loginPageHandler');
//   let login = app.fs.readFileSync('./public/login.html', 'utf8');
//   login = login.replace('message', req.cookies.message || '');
//   res.send(login);
// }

// const loginHandler = function(req, res) {
//   console.log('=======>inside loginHandler');
//   let registered_users = app.userStore.getUsers();
//   let user = registered_users[req.body.username];
//   if (!user) {
//     res.cookie('message', 'Wrong username', {
//       maxAge: 5
//     });
//     res.redirect('/login.html');
//     return;
//   }
//   let sessionid = new Date().getTime();
//   res.cookie('sessionid', sessionid);
//   user.sessionid = sessionid;
//   res.redirect('/home.html');
// }

// const loadUser = function(req, res, next) {
//   let registered_users = app.userStore.getUsers();
//   let sessionid = req.cookies.sessionid;
//   let user = Object.keys(registered_users).find((u) => {
//     return registered_users[u].sessionid == sessionid;
//   });
//   if (sessionid && user) {
//     req.user = registered_users[user];
//   }
//   next();
// }

// const todoRequestHandler = function(req, res) {
//   let allTodos = req.user.allTodos;
//   res.send(JSON.stringify(allTodos));
// }

// const preventDirectViewpageAccess = function(req, res) {
//   if (!req.cookies.currentTodo && req.url == '/view.html') {
//     res.redirect('/home.html');
//   }
// }

const addTodoItem = (req, todo) => {
  let items = req.body.items || [];
  if (typeof(items) != 'string') {
    items.forEach((todoItem) => {
      todo.addItem(todoItem);
    });
  } else {
    todo.addItem(items);
  }
}

const createTodoHandler = function(req, res) {
  console.log('=======>inside createTodoHandler');
  let todo = req.user.addTodo(req.body.title, req.body.description);
  addTodoItem(req, todo);
  res.redirect('/home.html');
}

const getTodo = (req) => {
  let todoIndex = req.cookies.currentTodo;
  let todo = req.user.getMentionedTodo(todoIndex);
  return todo;
}

const viewTodoHandler = function(req, res) {
  console.log('=======>inside viewTodoHandler');
  let todo = getTodo(req);
  console.log(todo);
  res.send(JSON.stringify(todo));
}

const deleteTodoHandler = function(req, res) {
  let todoIndex = req.cookies.currentTodo;
  req.user.deleteTodo(todoIndex);
  res.redirect('/home.html');
}

let editTitle = function(req, res, todoIndex) {
  let newTitle = req.body.title;
  req.user.updateTodoTitle(todoIndex, newTitle);
}

let editTodoDescription = function(req, res, todoIndex) {
  req.user.updateTodoDescription(todoIndex, req.body.description);
}

let editTodoItem = function(req, todo) {
  let label = Object.keys(req.body)[0];
  let item = req.body[label];
  let id = label.match(/[0-9]+/)[0];
  todo.updateItem(req.body[label], id);
}

const editTodoHandler = function(req, res) {
  let todo = getTodo(req);
  let todoIndex = req.cookies.currentTodo;

  let fieldToEdit = Object.keys(req.body)[0];
  let action = {
    title: editTitle,
    description: editTodoDescription
  };
  if (fieldToEdit.includes('label')) {
    editTodoItem(req, todo);
  } else {
    action[fieldToEdit](req, res, todoIndex);
  }
  res.redirect('/view.html');
}

const addItemHandler = function(req, res) {
  let todo = getTodo(req);
  addTodoItem(req, todo);
  res.redirect('/view.html');
}

const deleteItemHandler = function(req, res) {
  let todo = getTodo(req);
  todo.removeItem(req.body.id);
  res.redirect('/view.html');
}

const markStatusHandler = function(req, res) {
  console.log('=======>inside markStatusHandler');
  let todo = getTodo(req);
  todo.markItemAsDone(req.body.id);
  res.redirect('/view.html');
};

const unmarkStatusHandler = function(req, res) {
  console.log('=======>inside unmarkStatusHandler');
  let todo = getTodo(req);
  todo.markItemAsUndone(req.body.id);
  res.redirect('/view.html');
};

const redirectAccordingValidTodo = (req, res, todoIndex) => {
  if (req.user.getMentionedTodo(todoIndex)) {
    res.cookie('currentTodo', todoIndex);
    res.redirect('/view.html');
  } else {
    res.redirect('/home.html');
  }
}

const saveDatabase = function(req, res, next) {
  util.saveDatabase(app.fs, app.userStore.getUsers(), app.userStore.path);
  next();
}

const serveTodo = function(req, res, next) {
  let url = req.url;
  if (url.split('-').shift() == '/todo' && req.user) {
    let todoIndex = url.split('-').pop();
    redirectAccordingValidTodo(req, res, todoIndex);
    return;
  }
  next();
}

const logoutHandler = function(req, res) {
  console.log('=======>inside logoutHandler');
  res.cookie('sessionid', 0, {
    maxAge: 5
  });
  delete req.user;
  res.redirect('/login.html');
}

const redirectLoggedOutUserToLogin = function(req, res) {
  if (!req.user) {
    res.redirect('/login.html');
    return;
  }
  next();
}


app.use((req, res, next) => {
  req.urlIsOneOf = urlIsOneOf.bind(req);
  next();
});
app.use(express.urlencoded({
  extended: true,
  type: req => true
}));
app.use(cookieParser());
app.use(logRequest);
app.use('/login.html', redirectLoggedInUserToHome);
app.use(deleteCookie);
app.use(loadUser);
app.use(serveTodo);
app.use(preventDirectViewpageAccess);
app.use(redirectLoggedOutUserToLogin);
app.use(saveDatabase);
app.use(express.static('public'));

// app.get('/', landingPageHandler);
// app.get('/login.html', loginPageHandler);
// app.post('/login', loginHandler);
// app.get('/getAllTodo', todoRequestHandler);
// app.get('/getViewTodo', viewTodoHandler);
app.get('/deleteTodo', deleteTodoHandler);
app.post('/editTodo', editTodoHandler);
app.post('/deleteitem', deleteItemHandler);
app.post('/mark', markStatusHandler);
app.post('/unmark', unmarkStatusHandler);
app.post('/create', createTodoHandler);
app.get('/logout', logoutHandler);

module.exports = app;
