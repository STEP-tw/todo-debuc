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
    return todo;
  }
  get allTodos() {
    return this.todoLists;
  }
  getMentionedTodo(todoIndex) {
    return this.todoLists[todoIndex];
  }
  updateTodoTitle(index,newTitle){
    let todo = this.getMentionedTodo(index);
    todo.updateTitle(newTitle);
  }
  updateTodoDescription(index,newDescription){
    let todo = this.getMentionedTodo(index);
    todo.updateDescription(newDescription);
  }
  deleteTodo(todoIndex) {
    let todo = this.getMentionedTodo(todoIndex);
    if(todo) this.todoLists.splice(this.todoLists.indexOf(todo),1);
  }
}
module.exports = User;
