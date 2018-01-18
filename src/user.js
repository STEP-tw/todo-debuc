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
  deleteTodo(todo) {
    if(todo) this.todoLists.splice(this.todoLists.indexOf(todo),1);
  }
}
module.exports = User;
