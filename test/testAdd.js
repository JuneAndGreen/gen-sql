var assert = require('assert');
var should = require('should');

var map = require('./orm.json');
var DB = require('../index');

var d = new DB(map);

/**
 * 测试增语句
 */

describe('add module', function() {

  describe('action0', function() {
    it('增sql，默认主键为id，且会忽略', function() {
      var ret = d.add({
        table: 'user',
        data: {
      		username: 'asdasd',
      		password: 12345,
      		email: 'asd@as.sdf',
      		sex: 1,
      		description: 'yoyo',
      		head: 'asdasd'
      	}
      });
      ret.should.be.eql('INSERT INTO user ( username , password , email , sex , description , head ) VALUES ( "asdasd" , 12345 , "asd@as.sdf" , 1 , "yoyo" , "asdasd" )');
    });
  });

  describe('action1', function() {
    it('增sql，主键为username，且会忽略', function() {
      var ret = d.add({
        table: 'user',
      	key: 'username',
        data: {
      		username: 'asdasd',
      		password: 12345,
      		email: 'asd@as.sdf',
      		sex: 1,
      		description: 'yoyo',
      		head: 'asdasd'
      	}
      });
      ret.should.be.eql('INSERT INTO user ( password , email , sex , description , head ) VALUES ( 12345 , "asd@as.sdf" , 1 , "yoyo" , "asdasd" )');
    });
  });

  describe('action2', function() {
    it('增sql，主键为username，但不忽略', function() {
      var ret = d.add({
        table: 'user',
      	key: 'username',
      	isIgnoreKey: false,
        data: {
      		username: 'asdasd',
      		password: 12345,
      		email: 'asd@as.sdf',
      		sex: 1,
      		description: 'yoyo',
      		head: 'asdasd'
      	}
      });
      ret.should.be.eql('INSERT INTO user ( username , password , email , sex , description , head ) VALUES ( "asdasd" , 12345 , "asd@as.sdf" , 1 , "yoyo" , "asdasd" )');
    });
  });

  describe('action3', function() {
    it('增sql，默认主键为id，且会忽略，批量添加', function() {
      var ret = d.add({
        table: 'user',
        data: [{
      		username: 'asdasd',
      		password: 12345,
      		email: 'asd@as.sdf',
      		sex: 1,
      		description: 'yoyo',
      		head: 'asdasd'
      	}, {
      		username: 'qqwwrr',
      		password: 12345,
      		email: 'qqwwee@yee.sdf',
      		sex: 0,
      		description: 'nnn',
      		head: 'sw'
      	}, {
      		username: 'hwerwer',
      		password: 12345,
      		email: 'asd@hqwe.sdf',
      		sex: 1,
      		description: 'wetttt',
      		head: 'asdherjhasd'
      	}]
      });
      ret.should.be.eql('INSERT INTO user ( username , password , email , sex , description , head ) VALUES ( ("asdasd" , 12345 , "asd@as.sdf" , 1 , "yoyo" , "asdasd") , ("qqwwrr" , 12345 , "qqwwee@yee.sdf" , 0 , "nnn" , "sw") , ("hwerwer" , 12345 , "asd@hqwe.sdf" , 1 , "wetttt" , "asdherjhasd") )');
    });
  });

});
