const assert = require('chai').assert;
const fs = require('fs');

let User = require('../src/user.js');
let Todo = require('../src/todo.js');

describe('User', () => {
  let user;
  beforeEach(()=>{
    user = new User('debarun');
  });
  describe('#isSameUser', () => {
    it('should return true if given name is same as username', () => {
      assert.isOk(user.isSameUser('debarun'));
    });
    it('should return false if given name is same as username', () => {
      assert.isNotOk(user.isSameUser('debu'));
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
