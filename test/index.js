/*
* @Author: mike
* @Date:   2016-05-20 07:57:08
* @Last Modified 2016-05-20
* @Last Modified time: 2016-05-20 08:17:24
*/

'use strict';

import Module from '../src/'

import TestApp from 'nxus-core/lib/test/support/TestApp';

describe("Module", () => {
  var module, app;
 
  beforeEach(() => {
    app = new TestApp({oauth: {twitter: {consumerKey: 'somekey', consumerSecret: 'someSecret'}}});
    module = new Module(app);
  });
  
  describe("Load", () => {
    it("should not be null", () => Module.should.not.be.null)

    it("should be instantiated", () => {
      module = new Module(app);
      module.should.not.be.null;
    });
  });

  describe('Init', () => {
    it("should register gatherers", () => {
     return app.emit('load').then(() => {
        app.get.calledWith('oauth').should.be.true;
        app.get().gather.calledWith('strategy').should.be.true;
      });
    })
  })
})