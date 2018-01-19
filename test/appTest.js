const chai = require('chai');
const assert = chai.assert;

let request = require('./requestSimulator.js');
let app = require('../app.js');
let th = require('./testHelper.js');
process.env.DATA_STORE = "./data/testStore.json";

describe('app',()=>{
  let loggedInUser;
  beforeEach(()=>{
    loggedInUser = 'admin';
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
      request(app,{method:'POST',url:'/login',body:'username=admin'},res=>{
        th.should_be_redirected_to(res,'/home');
        th.should_not_have_cookie(res,'message');
        done();
      });
    });
    it('redirects to login with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'username=badUser'},res=>{
        th.should_be_redirected_to(res,'/login');
        th.should_have_expiring_cookie(res,'message','Wrong username or password');
        done();
      });
    });
  });

  describe('GET /home',()=>{
    it('serves the homepage if the user is logged in',()=>{
      request(app,{method:'GET',url:'/home',headers:{'cookie':'sessionid=12345'},user:loggedInUser},res=>{
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
      request(app,{method:'GET',url:'/create',headers:{'cookie':'sessionid=12345'},user:loggedInUser},res=>{
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
    it('redirects to homepage',()=>{
      let todo = 'title=test&description=demo&todo=a&todo=b';
      request(app,{method:'POST',url:'/create',user:loggedInUser,body:todo}, res=>{
        th.should_be_redirected_to(res,'/home');
      });
    });
  });

  describe('GET /todo-sort',()=>{
    it('redirects to view page',()=>{
      request(app,{method:'GET',url:'/todo-sort',user:loggedInUser},res=>{
        th.should_be_redirected_to(res,'/view');
      });
    });
    it('responds with 404',()=>{
      request(app,{method:'GET',url:'/todo-sort'},res=>{
        assert.equal(res.statusCode,404);
      });
    });
  });

  describe('GET /view',()=>{
    it('serves the todo if currentTodo cookie and user both are present',()=>{
      request(app,{method:'GET',url:'/view',user:loggedInUser, headers:{'cookie':'currentTodo=sort'}},res=>{
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
      request(app,{method:'GET',url:'/viewTodo',user:loggedInUser, headers:{'cookie':'currentTodo=sort'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'sort one.txt');
      });
    });
    it('redirects to homepage if cookie has no currentTodo',()=>{
      request(app,{method:'GET',url:'/viewTodo'},res=>{
        console.log(res);
        th.should_be_redirected_to(res,'/login');
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
