class Item {
  constructor(objective) {
    this.objective = objective;
    this.isDone = false;
  }
  getObjective(){
    return this.objective;
  }
  get status(){
    return this.isDone;
  }
  get markAsDone(){
    this.isDone = true;
  }
  get markAsUndone(){
    this.isDone = false;
  }
}
module.exports = Item;
