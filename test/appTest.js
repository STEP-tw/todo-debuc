const chai = require('chai');
const assert = chai.assert;

let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../app.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      });
    });
  });

  describe('GET /',()=>{
    it('redirects to index.html',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.should_be_redirected_to(res,'/login');
        assert.equal(res.body,"");
        done();
      });
    });
  });

  describe('GET /login',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/login'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Login:');
        th.body_does_not_contain(res,'Wrong username or password');
        th.should_not_have_cookie(res,'message');
        done();
      });
    });
    it('serves the login page with message for a failed login',done=>{
      request(app,{method:'GET',url:'/login',headers:{'cookie':'message=Wrong username or password'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Login:');
        th.body_contains(res,'Wrong username or password');
        th.should_not_have_cookie(res,'message');
        done();
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

  describe.skip('GET /home',()=>{
    it('serves the homepage',()=>{
      request(app,{method:'GET',url:'/home'},res=>{

      });
    });
  });

  describe.skip('POST /submitForm',()=>{
    it('serves the javascript source',done=>{
      request(app,{method:'POST',url:'/submitForm',body:'name=Foo&comment=Faa'},res=>{
        th.should_be_redirected_to(res,'/guestBook');
        done();
      })
    })
  })
})
