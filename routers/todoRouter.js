const express = require('express');

let todoRouter = express.Router();
let renderViewpage = require('../views/renderView.js').renderViewpage;

let serveTodo = function(req,res){
  if(req.params.todoId<0){
    return;
  }
  let view = todoRouter.fs.readFileSync('./public/view.html', 'utf8');
  let todo = req.user.getMentionedTodo(req.params.todoId);
  view = renderViewpage(view,todo,req.params.todoId);
  res.send(view);
}

let deleteTodo = function(req,res){
  let todoIndex = req.params.todoId;
  req.user.deleteTodo(todoIndex);
  res.send();
}

let editTodoItem = function(req,res) {
  let todo = req.user.getMentionedTodo(req.params.todoId);
  let label = Object.keys(req.body)[0];
  let item = req.body[label];
  let id = label.match(/[0-9]+/)[0];
  todo.updateItem(req.body[label], id);
}

const editTodo = function(req, res) {
  let fieldToEdit = Object.keys(req.body)[0];
  if (fieldToEdit.includes('label')) {
    editTodoItem(req,res);
  } else {
    req.user.updateTodo(req.params.todoId,req.body);
  }
  res.redirect(`/home/todo/${req.params.todoId}`);
}

const addTodoItem = function(req,res){
  let todo = req.user.getMentionedTodo(req.params.todoId);
  let items = req.body.items || [];
  if (typeof(items) != 'string') {
    items.forEach((todoItem) => {
      todo.addItem(todoItem);
    });
  } else {
    todo.addItem(items);
  }
  res.redirect(303,`/home/todo/${req.params.todoId}`);
}

const deleteItem = function(req, res) {
  let todo = req.user.getMentionedTodo(req.params.todoId);
  todo.removeItem(req.params.id);
  res.redirect(303,`/home/todo/${req.params.todoId}`);
}

const markTodoItem = function(req,res){
  let todo = req.user.getMentionedTodo(req.params.todoId);
  todo.markItemAsDone(req.params.id);
  res.redirect(303,`/home/todo/${req.params.todoId}`);
}

const unmarkTodoItem = function(req,res){
  let todo = req.user.getMentionedTodo(req.params.todoId);
  todo.markItemAsUndone(req.params.id);
  res.redirect(303,`/home/todo/${req.params.todoId}`);
}


todoRouter.get('/:todoId',serveTodo);
todoRouter.delete('/:todoId',deleteTodo);
todoRouter.post('/:todoId/edit',editTodo);
todoRouter.post('/:todoId/additem',addTodoItem);
todoRouter.delete('/:todoId/delete/:id',deleteItem);
todoRouter.post('/:todoId/mark/:id',markTodoItem);
todoRouter.post('/:todoId/unmark/:id',unmarkTodoItem);

module.exports=todoRouter;
