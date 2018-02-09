let addImgButton = function(imgSrc,id,onclick){
  return `<img src=${imgSrc} id=${id} onclick=${onclick}>`;
}

let renderItems = function(items){
  let html = ``;
  items.forEach((item,index)=>{
    html+= `<input type='checkbox' id="${index}" onclick='changeStatus(event)'`;
    if (item.isDone) html+= ` checked`;
    html+= `>`;
    html+= `<label id="label${index}">${item.getObjective()}`;
    html+= addImgButton("/img/edit.png",`label${index}`,"editTodoElement(event)");
    html+= `&nbsp`;
    html+= addImgButton("/img/delete.png",`label${index}`,"deleteListener(event)");
    html+= `</label><br>`;
  });
  return html;
}

let renderViewpage = function(view,todo,todoId){
  let html = ``;
  view=view.replace('${:id}',todoId);
  html+= `<h2 id='title'>${todo.getTitle()}`;
  html+= addImgButton("/img/edit.png","title","editTodoElement(event)");
  html+= `&nbsp</h2><br>`;
  html+= `<p id='description'>${todo.getDescription()}`;
  html+= addImgButton("/img/edit.png","description","editTodoElement(event)");
  html+= `&nbsp</p>`
  let items = todo.getItems();
  html+= renderItems(items);
  return view.replace('todoData',html);
}

exports.renderViewpage = renderViewpage;
