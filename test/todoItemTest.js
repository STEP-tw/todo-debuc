const assert = require('chai').assert;
const fs = require('fs');

let Item = require('../src/todoItem.js');

describe('todoItem', () => {
  let item;
  beforeEach(()=>{
    item = new Item('fill timesheet');
  });
  describe('#getObjective', ()=> {
    it('should give the objective of the item', () => {
      assert.equal(item.getObjective(),'fill timesheet');
    });
  });
  describe('#updateObjective', ()=> {
    it('should update the objective of the item', () => {
      assert.notEqual(item.getObjective(),'updated');
      item.updateObjective('updated');
      assert.equal(item.getObjective(),'updated');
    });
  });
  describe('#isDone', ()=> {
    it('should give the status of item', () => {
      assert.isNotOk(item.isDone);
    });
  });
  describe('#markAsDone', () => {
    it('should change the status of isDone true in todo item', () => {
      assert.isNotOk(item.isDone);
      item.markAsDone();
      assert.isOk(item.isDone);
    });
  });
  describe('#markAsUndone', () => {
    it('should change the status of isDone false in todo item', () => {
      item.markAsDone();
      assert.isOk(item.isDone);
      item.markAsUndone();
      assert.isNotOk(item.isDone);
    });
  });
});
