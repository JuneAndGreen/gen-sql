var assert = require('assert');
var should = require('should');

var map = require('./orm.json');
var DB = require('../index');

var d = new DB(map);

/**
 * 测试删语句
 */

 describe('del module', function() {

   describe('action0', function() {
     it('删sql，条件为字符串', function() {
       var ret = d.del({
         table: 'share',
         condition: 'id = 123'
       });
       ret.should.be.eql('DELETE FROM share WHERE id = 123');
     });
   });

   describe('action1', function() {
     it('删sql，条件为对象', function() {
       var ret = d.del({
         table: 'share',
         condition: {
           username: 'gasgg',
       		createTime: 1322456678112,
       		parentId: 14
       	}
       });
       ret.should.be.eql('DELETE FROM share WHERE username = "gasgg" AND create_time = 1322456678112 AND parent_id = 14');
     });
   });

   describe('action2', function() {
     it('删sql，条件为对象，存在对象值为数组', function() {
       var ret = d.del({
         table: 'share',
         condition: {
       		id: [12, 22, 55, 66]
       	}
       });
       ret.should.be.eql('DELETE FROM share WHERE id in (12 , 22 , 55 , 66)');
     });
   });

   describe('action3', function() {
     it('删sql，条件为对象，存在多个对象值为数组', function() {
       var ret = d.del({
         table: 'share',
         condition: {
       		id: [12, 22, 55, 66],
           parentId: [002, 12]
       	}
       });
       ret.should.be.eql('DELETE FROM share WHERE id in (12 , 22 , 55 , 66) AND parent_id in (2 , 12)');
     });
   });

 });
