let path = require('path');
const chai = require('chai');
const assert = chai.assert;
let MockFileSystem = require(path.resolve('test/mockFs.js'));
let User = require(path.resolve('src/user.js'));
let Todo = require(path.resolve('src/todo.js'));
let Item = require(path.resolve('src/todoItem.js'));
let util = require(path.resolve('util.js'));

describe('Util', () => {
  let allUsers, user, todo, todoItem;
  beforeEach(()=>{
    todoItem = {
      objective: 'go home',
      _isDone: false
    }
    todo = {
      title: 'office',
      description: '',
      items: [todoItem]
    }
    user = {
      username: 'sayima',
      todoLists: [todo]
    }
    allUsers = {sayima:user}
  });
  describe('#loadPrototypes', ()=> {
    it('should load all the behaviours to the users', () => {
      util.loadPrototypes(allUsers);
      assert.instanceOf(user,User);
      assert.instanceOf(todo,Todo);
      assert.instanceOf(todoItem,Item);
    });
  });
  describe('#getAllRegisteredUsers', ()=> {
    it('should read the given json file and returns instance of users', () => {
      let dummyfs = new MockFileSystem();
      dummyfs.addFile('/data',JSON.stringify(allUsers));
      allUsers = util.getAllRegisteredUsers(dummyfs,'/data');
      assert.instanceOf(allUsers['sayima'],User);
    });
  });
});
