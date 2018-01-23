let path = require('path');
const chai = require('chai');
const assert = chai.assert;

let User = require(path.resolve('src/user.js'));
let Todo = require(path.resolve('src/todo.js'));
let Item = require(path.resolve('src/todoItem.js'));
let util = require(path.resolve('util.js'));

describe('Util', () => {
  describe('#loadPrototypes', ()=> {
    let todoItem = {
      objective: 'go home',
      _isDone: false
    }
    let todo = {
      title: 'office',
      description: '',
      items: [todoItem]
    }
    let user = {
      username: 'sayima',
      todoLists: [todo]
    }
    let allUsers = {sayima:user}
    it('should load all the behaviours to the users', () => {
      util.loadPrototypes(allUsers);
      assert.instanceOf(user,User);
      assert.instanceOf(todo,Todo);
      assert.instanceOf(todoItem,Item);
    });
  });
});
