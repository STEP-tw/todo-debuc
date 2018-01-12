let reqListener = function() {
  let userDetails = JSON.parse(this.responseText);
  let todo = document.getElementById('todoLists');
  userDetails.todoLists.forEach((todoList)=>{
    let ref = document.createElement('a');
    ref.href = `/${todoList.title}`;
    ref.innerText = todoList.title;
    todo.appendChild(ref);
  });
}

const getAllTodo = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/getTodo`);
  oReq.send();
}

window.onload = getAllTodo;
