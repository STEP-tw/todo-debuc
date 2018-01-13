const assert = require('chai').assert;
const fs = require('fs');

let User = require('../src/user.js');
let Todo = require('../src/todo.js');

describe('User', () => {
  let user;
  beforeEach(()=>{
    user = new User('debarun','password');
  });
  describe('#isSameUser', () => {
    it('should return true if given name is same as username', () => {
      assert.isOk(user.isSameUser('debarun'));
    });
    it('should return false if given name is same as username', () => {
      assert.isNotOk(user.isSameUser('debu'));
    });
  });

  describe('#isSamePassword', () => {
    it('should return true if given password is same as user password', () => {
      assert.isOk(user.isSamePassword('password'));
    });
    it('should return false if given password is same as user password', () => {
      assert.isNotOk(user.isSamePassword('failword'));
    });
  });

  describe('#getMentionedTodo', () => {
    it('should return mentioned todo from all todo of the user', () => {
      let todo = new Todo('uniq','implement uniq');
      let todo2 = new Todo('sort','implement sort');
      user.addTodo(todo);
      user.addTodo(todo2);
      assert.deepEqual(user.getMentionedTodo('sort'),todo2);
    });
  });
});
