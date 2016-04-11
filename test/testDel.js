var map = require('./orm.json');
var DB = require('../index');

var d = new DB(map);

/**
 * 测试删语句
 */

console.log('删sql，条件为字符串 ------>');
console.log(d.del({
  table: 'share',
  condition: 'id = 123'
}));

console.log('----------------------------------------------');
console.log('删sql，条件为对象 ------>');
console.log(d.del({
  table: 'share',
  condition: {
    username: 'gasgg',
		createTime: 1322456678112,
		parentId: 14
	}
}));

console.log('----------------------------------------------');
console.log('删sql，条件为对象，存在对象值为数组 ------>');
console.log(d.del({
  table: 'share',
  condition: {
		id: [12, 22, 55, 66]
	}
}));

console.log('----------------------------------------------');
console.log('删sql，条件为对象，存在多个对象值为数组 ------>');
console.log(d.del({
  table: 'share',
  condition: {
		id: [12, 22, 55, 66],
    parentId: [002, 12]
	}
}));
