const assert = require('chai').assert;
const fs = require('fs');

let Todo = require('../src/todo.js');
let Item = require('../src/todoItem.js');

describe('Todo', () => {
  let todo;
  let item;
  beforeEach(()=>{
    todo = new Todo('Daily Routine','I have to maintain');
  });
  describe('#updateTitle',() => {
    it('should change the current title', () => {
      assert.equal(todo.getTitle(),'Daily Routine');
      todo.addItem('fill timesheet');
      todo.updateTitle('Change');
      assert.equal(todo.getTitle(),'Change');
    });
  });
  describe('#addItem', () => {
    it('should add item in the todo', () => {
      let expected=[];
      let item = new Item('have lunch');
      expected.push(item);
      assert.deepEqual(todo.getItems(),[]);
      todo.addItem('have lunch');
      assert.deepEqual(todo.getItems(),expected);
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
      let expected=[];
      let item = new Item('have lunch');
      expected.push(item);
      todo.addItem('have lunch');
      assert.deepEqual(todo.getItems(),expected);
      todo.removeItem('have lunch');
      expected.pop();
      assert.deepEqual(todo.getItems(),expected);
    });
  });
  describe('#markItemAsDone', () => {
    it('should return item status as true', () => {
      todo.addItem('fill timesheet');
      assert.isNotOk(todo.getItemStatus('fill timesheet'));
      todo.markItemAsDone(0);
      assert.isOk(todo.getItemStatus('fill timesheet'));
    });
  });
  describe('#markItemAsUndone', () => {
    it('should return item status as false', () => {
      todo.addItem('fill timesheet');
      todo.markItemAsDone(0);
      assert.isOk(todo.getItemStatus('fill timesheet'));
      todo.markItemAsUndone(0);
      assert.isNotOk(todo.getItemStatus('fill timesheet'));
    });
  });
});
