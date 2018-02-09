const express = require('express');
const util = require('../util.js');
const todoRouter = require('./todoRouter.js');

let renderHomepage = require('../views/renderHome.js').renderHomepage;

let homeRouter = express.Router();

const redirectLoggedOutUserToLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  next();
}

const saveToDatabase = function(req, res, next) {
  util.saveDatabase(homeRouter.fs,homeRouter.userStore.getUsers(),homeRouter.userStore.path);
  next();
}

let serveHome = function(req,res){
  let home = homeRouter.fs.readFileSync('./public/home.html', 'utf8');
  let allTodos = req.user.allTodoNames;
  home = renderHomepage(home,allTodos,`/home${req.url}`);
  res.send(home);
}

const injectDependencies = function(req, res, next) {
  todoRouter.fs = homeRouter.fs;
  next();
}

homeRouter.use('/',redirectLoggedOutUserToLogin);
homeRouter.use('/',saveToDatabase);
homeRouter.get('/',serveHome);
homeRouter.use('/todo',injectDependencies);
homeRouter.use('/todo',todoRouter);

module.exports=homeRouter;
