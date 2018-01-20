const chai = require('chai');
const assert = chai.assert;
const User=require('../src/user.js');
const Todo=require('../src/todo.js');

let request = require('./requestSimulator.js');
let app = require('../app.js');
let th = require('./testHelper.js');
process.env.DATA_STORE = "./data/testStore.json";

describe('app',()=>{
  let loggedInUser;
  beforeEach(()=>{
    loggedInUser = new User('sayima');
  });
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      });
    });
  });
  describe('GET /',()=>{
    it('serves the login page',()=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'Login:');
        th.body_does_not_contain(res,'Wrong username or password');
        th.should_not_have_cookie(res,'message');
      });
    });
  });
  describe('GET /login',()=>{
    it('serves the login page',()=>{
      request(app,{method:'GET',url:'/login'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Login:');
        th.body_does_not_contain(res,'Wrong username or password');
        th.should_not_have_cookie(res,'message');
      });
    });
    it('serves the login page with message for a failed login',()=>{
      request(app,{method:'GET',url:'/login',headers:{'cookie':'message=Wrong username or password'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Login:');
        th.body_contains(res,'Wrong username or password');
        th.should_not_have_cookie(res,'message');
      });
    });
    it('redirects to homepage if user is already logged in',()=>{
      request(app,{method:'GET',url:'/login',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/home');
      });
    });
  });
  describe('GET /index',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/index'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      });
    });
  });
  describe('POST /login',()=>{
    it('redirects to home for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'username=sayima'},res=>{
        th.should_be_redirected_to(res,'/home');
        th.should_not_have_cookie(res,'message');
        done();
      });
    });
    it('redirects to login with message for invalid user',()=>{
      request(app,{method:'POST',url:'/login',body:'username=badUser'},res=>{
        th.should_be_redirected_to(res,'/login');
        th.should_have_expiring_cookie(res,'message','Wrong username or password');
      });
    });
  });
  describe('GET /getAllTodo', ()=> {
    it('responds with json string if user is present', () => {
      loggedInUser.addTodo('testing');
      request(app,{method:'GET',url:'/getAllTodo',user:loggedInUser},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'title');
      });
    });
    it('redirects to login if user is not present', () => {
      request(app,{method:'GET',url:'/getAllTodo'},res=>{
        console.log(res);
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('GET /home',()=>{
    it('serves the homepage if the user is logged in',()=>{
      request(app,{method:'GET',url:'/home',user:loggedInUser},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Log Out');
      });
    });
    it('redirects to login if the user is not logged in',()=>{
      request(app,{method:'GET',url:'/home'},res=>{
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('GET /create',()=>{
    it('serves the create page if user is logged in',()=>{
      request(app,{method:'GET',url:'/create',user:loggedInUser},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Log Out');
      });
    });
    it('redirects to login if the user is not logged in',()=>{
      request(app,{method:'GET',url:'/create'},res=>{
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('POST /create',()=>{
    it('redirects to homepage if user is logged in',()=>{
      let todo = 'title=test&description=demo&items=a&items=b';
      request(app,{method:'POST',url:'/create',user:loggedInUser,body:todo}, res=>{
        th.should_be_redirected_to(res,'/home');
      });
    });
    it('redirects to login if user is not logged in', () => {
      let todo = 'title=test&description=demo&items=a&items=b';
      request(app,{method:'POST',url:'/create',body:todo}, res=>{
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('GET /todo-sort',()=>{
    it('redirects to view page if user is logged in',()=>{
      loggedInUser.addTodo('sort');
      request(app,{method:'GET',url:'/todo-sort',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
    it('responds with 404 if user is not logged in',()=>{
      request(app,{method:'GET',url:'/todo-sort'},res=>{
        assert.equal(res.statusCode,404);
      });
    });
  });
  describe('GET /todo-badname', ()=> {
    it('redirects to homepage if user is logged in', () => {
      request(app,{method:'GET',url:'/todo-badname',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/home');
      });
    });
    it('responds with 404 if user is not logged in',()=>{
      request(app,{method:'GET',url:'/todo-badname'},res=>{
        assert.equal(res.statusCode,404);
      });
    });
  });
  describe('GET /view',()=>{
    it('serves the todo if currentTodo cookie and user both are present',()=>{
      request(app,{method:'GET',url:'/view',user:loggedInUser, headers:{'cookie':'currentTodo=0'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Log Out');
        th.body_contains(res,'Delete');
      });
    });
    it('redirects to homepage if currentTodo cookie is present but user is not',()=>{
      request(app,{method:'GET',url:'/view',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/home');
      });
    });
    it('redirects to login if currentTodo cookie and user both are not present',()=>{
      request(app,{method:'GET',url:'/view'},res=>{
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('GET /viewTodo',()=>{
    it('returns the todo if currentTodo cookie present',()=>{
      loggedInUser.addTodo('sort');
      request(app,{method:'GET',url:'/viewTodo',user:loggedInUser, headers:{'cookie':'currentTodo=0'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'sort');
      });
    });
    it('redirects to homepage if cookie has no currentTodo',()=>{
      request(app,{method:'GET',url:'/viewTodo'},res=>{
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('GET /deleteTodo', ()=> {
    it('redirects to homepage if user is present', () => {
      loggedInUser.addTodo('sort');
      request(app,{method:'GET',url:'/deleteTodo',headers:{'cookie':'currentTodo=0'},user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/home');
      });
    });
    it('redirects to login page if user is not present', () => {
      request(app,{method:'GET',url:'/deleteTodo',headers:{'cookie':'currentTodo=0'}},res=>{
        th.should_be_redirected_to(res,'/login');
      });
    });
  });
  describe('POST /editTodo', ()=> {
    it('edits the title and redirects to view', () => {
      loggedInUser.addTodo('sort');
      request(app,{method:'POST',url:'/editTodo',headers:{'cookie':'currentTodo=0'},body:'title=test',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
    it('edits the description and redirects to view', () => {
      loggedInUser.addTodo('sort');
      request(app,{method:'POST',url:'/editTodo',headers:{'cookie':'currentTodo=0'},body:'description=test',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
    it('edits the item and redirects to view', () => {
      let todo = loggedInUser.addTodo('sort');
      todo.addItem('source');
      request(app,{method:'POST',url:'/editTodo',headers:{'cookie':'currentTodo=0'},body:'label0=test',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
    it('deletes the items and redirects to view if textbox is empty', () => {
      loggedInUser.addTodo('sort');
      request(app,{method:'POST',url:'/editTodo',headers:{'cookie':'currentTodo=0'},body:'label0=',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
  });
  describe('POST /additem', ()=> {
    it('edits the mentioned fields and redirects to view', () => {
      loggedInUser.addTodo('sort');
      request(app,{method:'POST',url:'/additem',headers:{'cookie':'currentTodo=0'},body:'items=test',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
  });
  describe('POST /mark', ()=> {
    it('edits the mentioned fields and redirects to view', () => {
      let todo = loggedInUser.addTodo('sort');
      todo.addItem('sample item');
      request(app,{method:'POST',url:'/mark',headers:{'cookie':'currentTodo=0'},body:'id=0',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
  });
  describe('POST /unmark', ()=> {
    it('edits the mentioned fields and redirects to view', () => {
      let todo = loggedInUser.addTodo('sort');
      todo.addItem('sample item');
      request(app,{method:'POST',url:'/unmark',headers:{'cookie':'currentTodo=0'},body:'id=0',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
  });
  describe('GET /logout', () => {
    it('redirects to login page and have expiring cookie',()=>{
      request(app,{method:'GET',url:'/logout',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/login');
        th.should_have_expiring_cookie(res,'sessionid','0');
      });
    });
    it('redirects to login page and have no cookie',()=>{
      request(app,{method:'GET',url:'/logout'},res=>{
        th.should_be_redirected_to(res,'/login');
        th.should_not_have_cookie(res,'sessionid');
      });
    });
  });
});
