class Item {
  constructor(objective) {
    this.objective = objective;
    this._isDone = false;
  }
  getObjective(){
    return this.objective;
  }
  updateObjective(objective){
    this.objective=objective;
  }
  get isDone(){
    return this._isDone;
  }
  markAsDone(){
    this._isDone = true;
  }
  markAsUndone(){
    this._isDone = false;
  }
}
module.exports = Item;
