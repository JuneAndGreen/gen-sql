var assert = require('assert');
var should = require('should');

var map = require('./orm.json');
var DB = require('../index');

var d = new DB(map);

/**
 * 测试查语句
 */

describe('add module', function() {

  describe('action0', function() {
    it('查sql，条件为字符串', function() {
      var ret = d.find({
        table: 'share',
        condition: 'id = 123'
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id = 123');
    });
  });

  describe('action1', function() {
    it('查sql，条件为对象', function() {
      var ret = d.find({
        table: 'share',
        condition: {
          username: 'gasgg',
      		createTime: 1322456678112,
      		parentId: 14
      	}
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE share.username = "gasgg" AND share.create_time = 1322456678112 AND share.parent_id = 14');
    });
  });

  describe('action2', function() {
    it('查sql，条件为对象，存在对象值为数组', function() {
      var ret = d.find({
        table: 'share',
        condition: {
      		id: [12, 22, 55, 66]
      	}
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE share.id in (12 , 22 , 55 , 66)');
    });
  });

  describe('action3', function() {
    it('查sql，条件为对象，存在多个对象值为数组', function() {
      var ret = d.find({
        table: 'share',
        condition: {
      		id: [12, 22, 55, 66],
          parentId: [002, 12]
      	}
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE share.id in (12 , 22 , 55 , 66) AND share.parent_id in (2 , 12)');
    });
  });

  describe('action4', function() {
    it('查sql，条件为字符串，存在分页', function() {
      var ret = d.find({
        table: 'share',
        offset: 10,
        limit: 20,
        condition: 'id = 123'
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id = 123 LIMIT 20 OFFSET 10');
    });
  });

  describe('action5', function() {
    it('查sql，条件为字符串，存在分页，搜索值为对象', function() {
      var ret = d.find({
        table: 'share',
        offset: 10,
        limit: 20,
        like: {
          value: 'xxx',
          type: 'front',
          attr: ['username', 'id']
        },
        condition: 'id = 123'
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id = 123 OR share.username LIKE "%xxx" OR share.id LIKE "%xxx" LIMIT 20 OFFSET 10');
    });
  });

  describe('action6', function() {
    it('查sql，条件为字符串，存在分页，搜索值为对象数组', function() {
      var ret = d.find({
        table: 'share',
        offset: 10,
        limit: 20,
        like: [{
          value: 'xxx',
          type: 'front',
          attr: ['username', 'id']
        }, {
          value: 'yyy',
          type: 'all',
          attr: 'createTime'
        }],
        condition: 'id = 123'
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id = 123 OR share.username LIKE "%xxx" OR share.id LIKE "%xxx" OR share.create_time LIKE "%yyy%" LIMIT 20 OFFSET 10');
    });
  });

  describe('action7', function() {
    it('查sql，条件为字符串，排序值为对象数组', function() {
      var ret = d.find({
        table: 'share',
        order: [{
          attr: 'other.username',
          type: 'desc'
        }, {
          attr: 'createTime',
          type: 'asc'
        }],
        condition: 'id = 123'
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id = 123 ORDER BY other.username DESC , share.create_time ASC');
    });
  });

  describe('action8', function() {
    it('查sql，使用表别名', function() {
      var ret = d.find({
        table: 'share',
        alias: {
          share: 's'
        },
        condition: 's.id = 123'
      });
      ret.should.be.eql('SELECT s.id AS id , s.username AS username , s.create_time AS createTime , s.parent_id AS parentId FROM share AS s WHERE s.id = 123');
    });
  });

  describe('action9', function() {
    it('查sql，使用表别名，进行表连接，值为对象数组', function() {
      var ret = d.find({
        table: 'share',
        alias: {
          share: 's',
          user: 'u',
          blog: 'b'
        },
        join: [{
          table: 'user',
          type: 'full',
          on: 'u.username = s.username'
        }, {
          table: 'blog',
          on: 'b.username = s.username'
        }],
        condition: 's.id = 123'
      });
      ret.should.be.eql('SELECT s.id AS id , s.username AS username , s.create_time AS createTime , s.parent_id AS parentId FROM share AS s FULL JOIN user AS u ON u.username = s.username LEFT JOIN blog AS b ON b.username = s.username WHERE s.id = 123');
    });
  });

  describe('action10', function() {
    it('查sql，使用分组', function() {
      var ret = d.find({
        table: 'share',
        group: {
          attr: 'username',
          having: 'COUNT(*) > 10'
        }
      });
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share GROUP BY username HAVING COUNT(*) > 10');
    });
  });

  describe('action11', function() {
    it('查sql，条件为字符串，使用表别名，进行表连接，获取方式为自定义', function() {
      var ret = d.find({
        table: 'share',
        alias: {
          share: 's',
          user: 'u'
        },
        join: {
          table: 'user',
          type: 'left',
          on: 'u.username = s.username'
        },
        field: {
          attr: ['u.email', 'u.description', 's.id', 's.username'],
          map: {
            'u.username': 'linkUsername'
          }
        },
        condition: 'id = 123'
      });
      ret.should.be.eql('SELECT u.email , u.description , s.id , s.username , u.username AS linkUsername FROM share AS s LEFT JOIN user AS u ON u.username = s.username WHERE id = 123');
    });
  });

  describe('action12', function() {
    it('查sql，条件为字符串，使用union', function() {
      var ret = d.find([{
        table: 'share',
        condition: 'id = 123'
      }, {
        table: 'share',
        condition: 'id < 10'
      }]);
      ret.should.be.eql('SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id = 123 UNION SELECT share.id AS id , share.username AS username , share.create_time AS createTime , share.parent_id AS parentId FROM share WHERE id < 10');
    });
  });

});
