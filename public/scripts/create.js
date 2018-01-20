let addTodoItem = function(){
  let list = document.getElementById('list');
  let text = document.createElement('input');
  text.type = 'text';
  text.name = 'items';
  list.appendChild(text);
  list.appendChild(document.createElement('br'));
}
  
