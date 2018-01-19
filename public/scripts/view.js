let createElement = function(elementType,id,innerText=''){
  let element = document.createElement(elementType);
  element.id = id;
  element.innerText = innerText;
  return element;
}

let appendChild = function(listOfElements,nodeToAppend){
  listOfElements.forEach((element)=>{
    nodeToAppend.appendChild(element);
  });
}

let addForm = function(element){
  let form = document.createElement('form');
  form.method = 'post';
  form.action = '/editTodo';
  let textBox = document.createElement('input');
  textBox.value = element.innerText;
  textBox.name = element.id;
  textBox.type = 'text';
  let submit = document.createElement('button');
  submit.type = 'submit';
  submit.innerText = 'save';
  appendChild([textBox,submit],form);
  return form;
}

let editTodoElement = function(event){
  let id = event.target.id;
  let div = document.getElementById('todo');
  let element = document.getElementById(id);
  let form = addForm(element);
  div.replaceChild(form,element);
}

let addEventOn = function(listOfElements,listener){
  listOfElements.forEach((element)=>{
    element.ondblclick = listener;
  });
}

let addTodoItemInPage = function(todoItems,div){
  let count = 0;
  todoItems.forEach((item)=>{
    let list = createElement('input',count);
    list.type = 'checkbox';
    if(item._isDone) list.checked = true;
    let label = createElement('label',`label${count}`,item.objective);
    label.ondblclick = editTodoElement;
    appendChild([list,label,document.createElement('br')],div);
    count++;
  });
}

let reqListener = function(){
  let todoData = JSON.parse(this.responseText);
  let div = document.querySelector('#todo');
  let heading = createElement('h2','title',todoData.title);
  let para = createElement('p','description',todoData.description);
  addEventOn([heading,para],editTodoElement);
  appendChild([heading,document.createElement('br')],div);
  appendChild([para,document.createElement('br')],div);
  addTodoItemInPage(todoData.items,div);
}

let viewTodo = function(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/viewTodo`);
  oReq.send();
}

window.onload = viewTodo;
