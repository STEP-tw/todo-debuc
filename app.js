const app = require('./webapp.js').create();
const lib = require('./appLib.js');

app.use(lib.logRequest);
app.use(lib.loadUser);
app.use(lib.redirectLoggedInUserToHome);
app.use(lib.redirectLoggedOutUserToLogin);
app.use(lib.deleteCookie);
app.use(lib.preventDirectViewpageAccess);
app.get('/',lib.landingPageHandler);
app.get('/login',lib.loginPageHandler);
app.post('/login',lib.loginHandler);
app.get('/logout',lib.logoutHandler);
app.get('/getAllTodo',lib.todoRequestHandler);
app.post('/create',lib.createTodoHandler);
app.get('/viewTodo',lib.viewTodoHandler);
app.get('/deleteTodo',lib.deleteTodoHandler);
app.post('/editTodo',lib.editTodoHandler);
app.post('/additem',lib.addItemHandler);
app.post('/mark',lib.markStatusHandler);
app.post('/unmark',lib.unmarkStatusHandler);
app.postProcess(lib.serveTodo);
app.postProcess(lib.serveStatic);

module.exports = app;
