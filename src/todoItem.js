class Item {
  constructor(objective) {
    this.objective = objective;
    this._isDone = false;
  }
  getObjective(){
    return this.objective;
  }
  get isDone(){
    return this._isDone;
  }
  get markAsDone(){
    this._isDone = true;
  }
  get markAsUndone(){
    this._isDone = false;
  }
}
module.exports = Item;
