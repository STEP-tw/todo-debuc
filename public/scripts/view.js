let reqListener = function(){
  let todoData = JSON.parse(this.responseText);
  let div = document.getElementById('todo');
  let heading = document.createElement('h2');
  heading.innerText = todoData.title;
  let para = document.createElement('p');
  para.innerText = todoData.description;
  div.appendChild(heading);
  div.appendChild(para);
  todoData.todo.forEach((todoItem)=>{
    let list = document.createElement('input');
    list.type = 'checkbox';
    div.appendChild(list);
    div.append(todoItem);
    div.appendChild(document.createElement('br'));
  });
}

let viewTodo = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/viewTodo`);
  oReq.send();
}

window.onload = viewTodo;
