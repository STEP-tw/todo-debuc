const assert = require('chai').assert;
const fs = require('fs');

let User = require('../src/user.js');

describe('User', () => {
  let user;
  beforeEach(()=>{
    user = new User('debarun');
  });
  describe('#isSameUser', () => {
    it('should give true if given name is same as username', () => {
      assert.isOk(user.isSameUser('debarun'));
    });
    it('should give false if given name is same as username', () => {
      assert.isNotOk(user.isSameUser('debu'));
    });
  });
  describe('#getUsername', ()=> {
    it('should give the username', () => {
      assert.equal(user.getUsername(),'debarun');
    });
  });
  describe('#addTodo', ()=> {
    it('should add a todo in user', () => {
      let todo = user.addTodo('demo');
      assert.include(user.todoLists,todo);
    });
  });
  describe('#allTodos', ()=> {
    it('should give array of all todos of that user', () => {
      assert.deepEqual(user.allTodos,[]);
    });
  });
  describe('#getMentionedTodo', () => {
    it('should give mentioned todo from all todo of the user', () => {
      let todo = {title:'sort',description:'implement sort',items:[]}
      user.addTodo('uniq','implement uniq');
      user.addTodo('sort','implement sort');
      assert.deepEqual(user.getMentionedTodo(1),todo);
    });
  });
  describe('#updateTodoTitle', ()=> {
    it('should change the title of the todo', () => {
      let expected = {title:'sort',description:'',items:[]};
      user.addTodo('uniq');
      assert.notDeepInclude(user.allTodos,expected);
      user.updateTodoTitle(0,'sort');
      assert.deepInclude(user.allTodos,expected);
    });
  });
  describe('#updateTodoDescription', ()=> {
    it('should change the description of the todo', () => {
      let expected = {title:'uniq',description:'hi',items:[]};
      user.addTodo('uniq','');
      assert.notDeepInclude(user.allTodos,expected);
      user.updateTodoDescription(0,'hi');
      assert.deepInclude(user.allTodos,expected);
    });
  });
  describe('#deleteTodo', ()=> {
    it('should delete the todo of given title', () => {
      let todo = user.addTodo('uniq');
      assert.equal(user.allTodos.length,1);
      assert.deepInclude(user.allTodos,todo);
      user.deleteTodo(0)
      assert.notEqual(user.allTodos.length,1);
      assert.notDeepInclude(user.allTodos,todo);
    });
    it('should not delete todo if the given title is wrong', () => {
      let todo = user.addTodo('uniq');
      assert.equal(user.allTodos.length,1);
      user.deleteTodo('unique')
      assert.equal(user.allTodos.length,1);
    });
  });
});
