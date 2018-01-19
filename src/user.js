let Todo = require('./todo.js');
class User {
  constructor(username) {
    this.username = username;
    this.todoLists = [];
  }
  isSameUser(givenUsername) {
    return this.username==givenUsername;
  }
  getUsername(){
    return this.username;
  }
  addTodo(title,description){
    let todo = new Todo(title,description);
    this.todoLists.push(todo);
    return todo
  }
  get allTodos() {
    return this.todoLists;
  }
  getMentionedTodo(todoTitle) {
    return this.todoLists.find(function(todo){
      return todo.getTitle() == todoTitle;
    });
  }
  updateTodoTitle(title,newTitle){
    let todo = this.getMentionedTodo(title);
    todo.updateTitle(newTitle);
  }
  updateTodoDescription(title,newDescription){
    let todo = this.getMentionedTodo(title);
    todo.updateDescription(newDescription);
  }
  deleteTodo(todo) {
    if(todo) this.todoLists.splice(this.todoLists.indexOf(todo),1);
  }
}
module.exports = User;
