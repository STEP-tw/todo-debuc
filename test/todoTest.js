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
  describe('#getTitle', ()=> {
    it('should give the title of the todo', () => {
      assert.equal(todo.getTitle(),'Daily Routine');
    });
  });
  describe('#updateTitle',() => {
    it('should change the current title', () => {
      assert.equal(todo.getTitle(),'Daily Routine');
      todo.updateTitle('Change');
      assert.equal(todo.getTitle(),'Change');
    });
  });
  describe('#getDescription', ()=> {
    it('should give the description of the todo', () => {
      assert.equal(todo.getDescription(),'I have to maintain');
    });
  });
  describe('#updateDescription', ()=> {
    it('should change the current description', () => {
      todo.updateDescription('');
      assert.equal(todo.getDescription(),'');
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
    it('should not add item in the todo if it is null string.', () => {
      let expected=[];
      assert.deepEqual(todo.getItems(),[]);
      todo.addItem('');
      assert.deepEqual(todo.getItems(),expected);
    });
  });
  describe('#getItems', ()=> {
    it('should give all the items', () => {
      let item = new Item('have lunch');
      todo.addItem('have lunch');
      assert.deepInclude(todo.getItems(),item);
    });
  });
  describe('#updateItem', ()=> {
    it('should update the objective of given item', () => {
      let item = new Item('cool');
      todo.addItem('have lunch');
      assert.notDeepInclude(todo.getItems(),item);
      todo.updateItem('cool',0);
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
      let expected = {objective:'fill timesheet',_isDone:true}
      todo.addItem('fill timesheet');
      assert.notDeepInclude(todo.getItems(),expected);
      todo.markItemAsDone(0);
      assert.deepInclude(todo.getItems(),expected);
    });
  });
  describe('#markItemAsUndone', () => {
    it('should return item status as false', () => {
      let expected = {objective:'fill timesheet',_isDone:false}
      todo.addItem('fill timesheet');
      todo.markItemAsDone(0);
      assert.notDeepInclude(todo.getItems(),expected);
      todo.markItemAsUndone(0);
      assert.deepInclude(todo.getItems(),expected);
    });
  });
});
