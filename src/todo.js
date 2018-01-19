let Item = require('../src/todoItem.js');

class Todo {
  constructor(title,description='') {
    this.title = title;
    this.description = description;
    this.items = [];
  }
  getTitle(){
    return this.title;
  }
  updateTitle(title){
    this.title=title;
  }
  updateDescription(description){
    this.description=description;
  }
  updateItem(objective,id){
    this.items[id].updateObjective(objective);
  }
  getDescription(){
    return this.description;
  }
  getItems(){
    return this.items;
  }
  addItem(objective){
    let item = new Item(objective);
    this.items.push(item);
  }
  findItem(objective){
    return this.items.find(function(todoItem){
      return todoItem.objective == objective;
    });
  }
  removeItem(objective){
    let item = this.findItem(objective);
    if(item) this.items.splice(this.items.indexOf(item),1);
  }
  markItemAsDone(objective){
    let item = this.findItem(objective);
    item.markAsDone;
  }
  markItemAsUndone(objective){
    let item = this.findItem(objective);
    item.markAsUndone;
  }
  getItemStatus(objective){
    let item = this.findItem(objective);
    return item.isDone;
  }
}
module.exports = Todo;
