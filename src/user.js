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
  get allTodoNames() {
    return this.todoLists.map((todo)=>todo.getTitle());
  }
  getMentionedTodo(todoIndex) {
    return this.todoLists[todoIndex];
  }
  updateTodo(index,todoInfo){
    let todo = this.getMentionedTodo(index);
    todo.updateTitle(todoInfo.title||todo.getTitle());
    todo.updateDescription(todoInfo.description||todo.getDescription());
  }
  deleteTodo(todoIndex) {
    let todo = this.getMentionedTodo(todoIndex);
    if(todo) this.todoLists.splice(this.todoLists.indexOf(todo),1);
  }
}
module.exports = User;
