let reqListener = function() {
  let userDetails = JSON.parse(this.responseText);
  let todoDiv = document.getElementById('todoLists');
  userDetails.todoLists.forEach((todo)=>{
    let reference = document.createElement('a');
    reference.href = `/todo-${todo.title}`;
    reference.innerText = todo.title;
    todoDiv.appendChild(reference);
    todoDiv.appendChild(document.createElement('br'));
  });
}

const getAllTodo = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/getTodo`);
  oReq.send();
}

window.onload = getAllTodo;
