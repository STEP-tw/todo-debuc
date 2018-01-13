class User {
  constructor(username,password) {
    this.user = username;
    this.password = password;
    this.todoLists = [];
  }
  isSameUser(givenUsername) {
    return this.user==givenUsername;
  }
  isSamePassword(givenPassword) {
    return this.password==givenPassword;
  }
  addTodo(todo){
    this.todoLists.push(todo);
  }
  get allTodos() {
    return this.todoLists;
  }
  getMentionedTodo(todoTitle) {
    return this.todoLists.find(function(todo){
      return todo.getTitle() == todoTitle;
    });
  }
}
module.exports = User;
