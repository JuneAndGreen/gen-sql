var map = require('./orm.json');
var DB = require('../index');

var d = new DB(map);

/**
 * 测试增语句
 */

console.log('增sql，默认主键为id，且会忽略 ------>');
console.log(d.add({
  table: 'user',
  data: {
		username: 'asdasd',
		password: 12345,
		email: 'asd@as.sdf',
		sex: 1,
		description: 'yoyo',
		head: 'asdasd'
	}
}));

console.log('----------------------------------------------');
console.log('增sql，主键为username，且会忽略 ------>');
console.log(d.add({
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
}));

console.log('----------------------------------------------');
console.log('增sql，主键为username，但不忽略 ------>');
console.log(d.add({
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
}));

console.log('----------------------------------------------');
console.log('增sql，默认主键为id，且会忽略，批量添加 ------>');
console.log(d.add({
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
}));
