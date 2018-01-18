let createElement = function(elementType,innerText=''){
  let element = document.createElement(elementType);
  element.innerText = innerText;
  return element;
}

let appendChild = function(listOfElements,nodeToAppend){
  listOfElements.forEach((element)=>{
    nodeToAppend.appendChild(element);
  });
}

let editTodoItem = function(event){
  let id = event.target.id;
  let div = document.getElementById('todo');
  let label = document.getElementById(id);
  let textBox = document.createElement('input');
  textBox.value = label.innerText;
  textBox.type = 'text';
  div.replaceChild(textBox,label);
}

let reqListener = function(){
  let count = 0;
  let todoData = JSON.parse(this.responseText);
  let div = document.querySelector('#todo');
  let heading = createElement('h2',todoData.title);
  let para = createElement('p',todoData.description);
  appendChild([heading,para],div);
  todoData.items.forEach((todoItem)=>{
    let list = createElement('input');
    list.type = 'checkbox';
    list.id = count;
    if(todoItem._isDone) list.checked = true;
    let label = createElement('label',todoItem.objective);
    label.id = `label${count}`;
    label.ondblclick = editTodoItem;
    appendChild([list,label,document.createElement('br')],div);
    count++;
  });
}

let viewTodo = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/viewTodo`);
  oReq.send();
}

window.onload = viewTodo;
