const fs = require('fs');

let toS = o=>JSON.stringify(o,null,2);

let getAllRegisteredUsers = function(){
  let data = fs.readFileSync('./data/registeredUsers.json','utf8');
  let allUsers = JSON.parse(data);
  return allUsers;
}

let getContentHeader = function(filepath,header){
  let extension = filepath.split('.')[2]||'html';
  return header[extension];
}

let saveDatabase = function(username,todo){
  let allUsers = getAllRegisteredUsers();
  let user = allUsers.find(u=>{
    return u.userName == username;
  });
  user.todoLists.push(todo);
  allUsers = JSON.stringify(allUsers,null,2);
  fs.writeFileSync('./data/registeredUsers.json',allUsers,'utf8');
}

exports.getAllRegisteredUsers = getAllRegisteredUsers;
exports.getContentHeader = getContentHeader;
exports.saveDatabase = saveDatabase;
