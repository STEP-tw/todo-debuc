const fs = require('fs');

let User = require('./src/user.js');
let Todo = require('./src/todo.js');
let Item = require('./src/todoItem.js');

let toS = o=>JSON.stringify(o,null,2);

let loadPrototypes = function(allUsers){
  Object.keys(allUsers).forEach((user)=>{
    allUsers[user].__proto__ = new User().__proto__;
    allUsers[user].todoLists.forEach((todo)=>{
      todo.__proto__ = new Todo().__proto__;
      todo.items.forEach((todoItem)=>{
        todoItem.__proto__ = new Item().__proto__;
      });
    });
  });
  return allUsers;
}

let getAllRegisteredUsers = function(pathToFetch){
  let data = fs.readFileSync(pathToFetch,'utf8');
  let allUsers = JSON.parse(data);
  allUsers = loadPrototypes(allUsers);
  return allUsers;
}

let getContentHeader = function(filepath){
  let header = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpg',
    js: 'application/javascript',
    pdf: 'application/pdf',
    png: 'image/png'
  }
  let extension = filepath.split('.')[2]||'html';
  return header[extension];
}

let saveDatabase = function(allUsers,pathToStore){
  allUsers = JSON.stringify(allUsers,null,2);
  fs.writeFileSync(pathToStore,allUsers,'utf8');
}

exports.getAllRegisteredUsers = getAllRegisteredUsers;
exports.getContentHeader = getContentHeader;
exports.saveDatabase = saveDatabase;
