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
    if (title) this.title=title;
  }
  getDescription(){
    return this.description;
  }
  updateDescription(description){
    this.description=description;
  }
  addItem(objective){
    let item = new Item(objective);
    if(objective) this.items.push(item);
  }
  getItems(){
    return this.items;
  }
  updateItem(objective,id){
    if(objective) this.items[id].updateObjective(objective);
  }
  findItem(objective){
    return this.items.find(function(todoItem){
      return todoItem.objective == objective;
    });
  }
  removeItem(objectiveIndex){
    this.items.splice(objectiveIndex,1);
  }
  markItemAsDone(objectiveIndex){
    this.items[objectiveIndex].markAsDone();
  }
  markItemAsUndone(objectiveIndex){
    this.items[objectiveIndex].markAsUndone();
  }
}
module.exports = Todo;
