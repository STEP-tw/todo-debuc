const assert = require('chai').assert;
const fs = require('fs');

let Todo = require('../src/todo.js');
let Item = require('../src/todoItem.js');

describe('Todo', () => {
  let todo;
  let item;
  beforeEach(()=>{
    todo = new Todo('Daily Routine','I have to maintain');
    item = new Item('fill timesheet');
  });
  describe('#addItem', () => {
    it('should add item in the todo', () => {
      assert.notDeepInclude(todo.getItems(),item);
      todo.addItem('fill timesheet');
      assert.deepInclude(todo.getItems(),item);
    });
  });
  describe('#findItem', () => {
    it('should return the item which has same objective as given', () => {
      let item2 = new Item('have lunch');
      todo.addItem('fill timesheet');
      todo.addItem('have lunch');
      assert.deepEqual(todo.findItem('have lunch'),item2);
    });
  });
  describe('#removeItem', () => {
    it('should remove item in the todo', () => {
      todo.addItem('fill timesheet');
      assert.deepInclude(todo.getItems(),item);
      todo.removeItem('fill timesheet');
      assert.notDeepInclude(todo.getItems(),item);
    });
  });
  describe('#markItemAsDone', () => {
    it('should return item status as true', () => {
      todo.addItem('fill timesheet');
      assert.isNotOk(todo.getItemStatus('fill timesheet'));
      todo.markItemAsDone('fill timesheet');
      assert.isOk(todo.getItemStatus('fill timesheet'));
    });
  });
  describe('#markItemAsUndone', () => {
    it('should return item status as false', () => {
      todo.addItem('fill timesheet');
      todo.markItemAsDone('fill timesheet');
      assert.isOk(todo.getItemStatus('fill timesheet'));
      todo.markItemAsUndone('fill timesheet');
      assert.isNotOk(todo.getItemStatus('fill timesheet'));
    });
  });
});
