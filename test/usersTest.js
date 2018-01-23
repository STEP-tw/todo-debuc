let path = require('path');
let Users = require(path.resolve('src/users.js'));
let MockFileSystem = require(path.resolve('test/mockFs.js'));
let assert = require('chai').assert;

describe('Users', () => {
  let users;
  let user;
  let userdata;
  beforeEach(()=>{
    users = new Users('./data/registeruser');
    user = {username:'sayima'}
    userdata = {
      'sayima':user
    }
  })
  describe('#loadUsers', ()=> {
    it('should load the users', () => {
      assert.deepEqual(users.getUsers(),{});
      users.loadUsers(userdata);
      assert.deepEqual(users.getUsers(),userdata);
    });
  });
  describe('#save', ()=> {
    it('should write all users data on file', () => {
      let dummyfs= new MockFileSystem();
      users.loadUsers(userdata);
      users.save(dummyfs);
      assert.equal(dummyfs.readFileSync('./data/registeruser'),JSON.stringify(userdata));
    });
  });
  describe('#getUsers', ()=> {
    it('should give all the users', () => {
      assert.deepEqual(users.getUsers(),{});
    });
  });
  describe('#findUser', ()=> {
    it('should give the user of given username', () => {
      users.loadUsers(userdata);
      assert.deepEqual(users.findUser('sayima'),user);
    });
  });
  describe('#addUser', ()=> {
    it('should add user in users', () => {
      assert.isNotOk(Object.keys(users.getUsers()).includes('debarun'));
      users.addUser('debarun');
      assert.isOk(Object.keys(users.getUsers()).includes('debarun'));
    });
  });
});
