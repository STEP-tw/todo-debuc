let Item = require('../src/todoItem.js');

let popElement = function(list,element) {
  let count = 0;
  while(list[count]!=element){
    count++;
  }
  list.splice(count,1);
}

class Todo {
  constructor(title,description) {
    this.title = title;
    this.description = description;
    this.items = [];
  }
  getTitle(){
    return this.title;
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
  findItem(itemObjective){
    return this.items.find(function(todoItem){
      return todoItem.objective == itemObjective;
    });
  }
  removeItem(itemObjective){
    let item = this.findItem(itemObjective);
    if(item) popElement(this.items,item);
  }
  markItemAsDone(itemObjective){
    let item = this.findItem(itemObjective);
    item.markAsDone;
  }
  markItemAsUndone(itemObjective){
    let item = this.findItem(itemObjective);
    item.markAsUndone;
  }
  getItemStatus(itemObjective){
    let item = this.findItem(itemObjective);
    return item.status;
  }
}
module.exports = Todo;
