var map = require('./orm.json');
var DB = require('../index');

var d = new DB(map);

/**
 * 测试查语句
 */

console.log('查sql，条件为字符串 ------>');
console.log(d.find({
  table: 'share',
  condition: 'id = 123'
}));

console.log('----------------------------------------------');
console.log('查sql，条件为对象 ------>');
console.log(d.find({
  table: 'share',
  condition: {
    username: 'gasgg',
		createTime: 1322456678112,
		parentId: 14
	}
}));

console.log('----------------------------------------------');
console.log('查sql，条件为对象，存在对象值为数组 ------>');
console.log(d.find({
  table: 'share',
  condition: {
		id: [12, 22, 55, 66]
	}
}));

console.log('----------------------------------------------');
console.log('查sql，条件为对象，存在多个对象值为数组 ------>');
console.log(d.find({
  table: 'share',
  condition: {
		id: [12, 22, 55, 66],
    parentId: [002, 12]
	}
}));

console.log('----------------------------------------------');
console.log('查sql，条件为字符串，存在分页 ------>');
console.log(d.find({
  table: 'share',
  offset: 10,
  limit: 20,
  condition: 'id = 123'
}));

console.log('----------------------------------------------');
console.log('查sql，条件为字符串，存在分页，搜索值为对象 ------>');
console.log(d.find({
  table: 'share',
  offset: 10,
  limit: 20,
  like: {
    value: 'xxx',
    type: 'front',
    attr: ['username', 'id']
  },
  condition: 'id = 123'
}));

console.log('----------------------------------------------');
console.log('查sql，条件为字符串，存在分页，搜索值为对象数组 ------>');
console.log(d.find({
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
}));

console.log('----------------------------------------------');
console.log('查sql，条件为字符串，排序值为对象数组 ------>');
console.log(d.find({
  table: 'share',
  order: [{
    attr: 'other.username',
    type: 'desc'
  }, {
    attr: 'createTime',
    type: 'asc'
  }],
  condition: 'id = 123'
}));

console.log('----------------------------------------------');
console.log('查sql，使用表别名 ------>');
console.log(d.find({
  table: 'share',
  alias: {
    share: 's'
  },
  condition: 's.id = 123'
}));

console.log('----------------------------------------------');
console.log('查sql，使用表别名，进行表连接，值为对象数组 ------>');
console.log(d.find({
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
}));


console.log('----------------------------------------------');
console.log('查sql，使用分组 ------>');
console.log(d.find({
  table: 'share',
  group: {
    attr: 'username',
    having: 'COUNT(*) > 10'
  }
}));

console.log('----------------------------------------------');
console.log('查sql，条件为字符串，使用表别名，进行表连接，获取方式为自定义 ------>');
console.log(d.find({
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
}));

console.log('----------------------------------------------');
console.log('查sql，条件为字符串，使用union ------>');
console.log(d.find([{
  table: 'share',
  condition: 'id = 123'
}, {
  table: 'share',
  condition: 'id < 10'
}]));
