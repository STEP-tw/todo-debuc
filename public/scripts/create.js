let addTodoItem = function(){
  let list = document.getElementById('list');
  let text = document.createElement('input');
  text.type = 'text';
  text.name = `todo`;
  list.appendChild(text);
  list.appendChild(document.createElement('br'));
}
