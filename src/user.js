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
