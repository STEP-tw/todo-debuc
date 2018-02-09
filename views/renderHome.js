let renderHomepage = function(home,todoNames,url){
  let html = ``;
  todoNames.forEach((todoName,index)=>{
    html+= `<a href='${url}todo/${index}'>${todoName}</a>`;
    html+=`<br>`;
  });
  home = home.replace('allTodoNames',html);
  return home;
}

exports.renderHomepage = renderHomepage;
