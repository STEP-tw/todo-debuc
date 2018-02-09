let appendChild = function(listOfElements,nodeToAppend){
  listOfElements.forEach((element)=>{
    nodeToAppend.appendChild(element);
  });
}

let addForm = function(element){
  let form = document.createElement('form');
  form.method = 'post';
  form.action = `${window.location.href}/edit`;
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

let changeStatus = function(event){
  let id = event.target.id;
  let checkBox = document.getElementById(id);
  let url=checkBox.checked ?`${window.location.href}/mark/${id}`:`${window.location.href}/unmark/${id}`;
  let oReq = new XMLHttpRequest();
  oReq.open("POST",url);
  oReq.send(`id=${id}`);
}

let deleteListener = function(event){
  let id=event.target.id;
  id=id.split('label').pop();
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load",()=>window.location.reload());
  oReq.open("DELETE",`${window.location.href}/delete/${id}`);
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

let deleteTodo = function(){
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load",()=>window.location.href='/home');
  oReq.open("DELETE",window.location.href);
  oReq.send();
}
