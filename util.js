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

// let determineContentForUser = function(req,data){
//   let template = "";
//   if(!req.user){
//     template = fs.readFileSync('./templates/notLoggedIn.templates','utf8');
//   }else{
//     template = fs.readFileSync('./templates/loggedIn.templates','utf8');
//     template = template.replace('username',`${req.user.userName}`);
//   }
//   data = data.replace('template',template);
//   return data;
// }

exports.getAllRegisteredUsers = getAllRegisteredUsers;
exports.getContentHeader = getContentHeader;
// exports.determineContentForUser = determineContentForUser;
