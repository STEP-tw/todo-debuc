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

exports.getAllRegisteredUsers = getAllRegisteredUsers;
exports.getContentHeader = getContentHeader;
