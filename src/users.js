const path = require('path');
const User = require(path.resolve('src/user.js'));

class Users {
  constructor(path) {
    this.path=path;
    this.users = {};
  }
  loadUsers(userData) {
    this.users = userData;
  }
  save(fs){
    fs.writeFileSync(this.path,JSON.stringify(this.users));
  }
  getUsers(){
    return this.users;
  }
  findUser(userName){
    return this.users[userName];
  }
  addUser(user){
    let newUser=new User(user);
    this.users[user]=newUser;
  }
}
module.exports=Users;
