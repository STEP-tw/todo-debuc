let reqListener = function() {
  let count = 0;
  let todoLists = JSON.parse(this.responseText);
  let todoDiv = document.getElementById('todoLists');
  todoLists.forEach((todo)=>{
    let reference = document.createElement('a');
    reference.href = `/todo-${count}`;
    reference.innerText = todo.title;
    todoDiv.appendChild(reference);
    todoDiv.appendChild(document.createElement('br'));
    count++;
  });
}

const getAllTodo = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/getAllTodo`);
  oReq.send();
}

window.onload = getAllTodo;
