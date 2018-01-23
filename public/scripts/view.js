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

let changeStatus = function(event){
  let id = event.target.id;
  let checkBox = document.getElementById(id);
  let url=checkBox.checked ?'/mark':'/unmark';
  let oReq = new XMLHttpRequest();
  oReq.open("POST",url);
  oReq.send(`id=${id}`);
}

let deleteListener = function(event){
  let id=event.target.id;
  id=id.split('label').pop();
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load",()=>window.location.reload());
  oReq.open("POST",'/deleteitem');
  oReq.send(`id=${id}`);
}

let generateButton = function(imgSrc,id,listener){
  let img=document.createElement('img');
  img.src = imgSrc;
  img.id = id;
  img.onclick = listener;
  return img;
}

let addEditAndDeleteButton = function(item,id){
  let editButton = generateButton('/img/edit.png',id,editTodoElement);
  let deleteButton = generateButton('/img/delete.png',id,deleteListener);
  item.appendChild(editButton);
  item.appendChild(deleteButton);
}

let displayTodoItems = function(todoItems,div){
  let count = 0;
  todoItems.forEach((item)=>{
    let checkBox = createElement('input',count);
    checkBox.type = 'checkbox';
    checkBox.onclick = changeStatus;
    if(item._isDone) checkBox.checked = true;
    let label = createElement('label',`label${count}`,item.objective);
    addEditAndDeleteButton(label,`label${count}`);
    appendChild([checkBox,label,document.createElement('br')],div);
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
  displayTodoItems(todoData.items,div);
}

let viewTodo = function(){
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", `/viewTodo`);
  oReq.send();
}

let addTodoItem = function(){
  let list = document.getElementById('list');
  let text = document.createElement('input');
  text.type = 'text';
  text.name = 'items';
  list.appendChild(text);
  list.appendChild(document.createElement('br'));
}


window.onload = viewTodo;
