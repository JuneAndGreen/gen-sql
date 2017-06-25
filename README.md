# gen-sql

## 简介

这是一个使用es6的一些特性实现的超级简单的sql语句生成器。

## 安装

```bash
npm install --save gen-sql
```

## 初始化

```javascript
let DB = require('gen-sql');

let d = new DB();
```

之后执行对应的语句即可生成对应的sql语句和data数组，对应data数组的位置在sql语句中会用?占位。


## 增语句

```javascript
d.add({
  table: 'xxx', // 表名
  data: {
    // 插入的数据，可为数组，如下面的例子
    xxx: 123,
    yyy: 'xxx'
  }
});
```

```javascript
d.add({
  table: 'xxx', // 表名
  data: [{
    // 插入的数据，可为数组
    xxx: 123,
    yyy: 'xxx'
  }, {
    xxx: 124,
    yyy: 'yyy'
  }]
});
```

## 删语句

```javascript
d.del({
  table: 'xxx', // 表名
  condition: 'where id = 123' // 条件
});
```

```javascript
d.del({
  table: 'xxx', // 表名
  condition: {
    // 条件，值和key之间用=号连接，条件之间使用and连接
    xxx: 'gasgg',
		yyy: 1322456678112
	}
});
```

```javascript
d.del({
  table: 'xxx', // 表名
  condition: [
    // 条件，值和key之间用=号连接，条件之间使用and连接，而每个对象之间会用or连接
    {xxx: 'gasgg'},
		{yyy: 1322456678112}
	]
});
```

```javascript
d.del({
  table: 'xxx', // 表名
  condition: {
    // 条件可为多值，最终生成in语句
		id: [12, 22, 55, 66]
	}
});
```

```javascript
d.del({
  table: 'xxx', // 表名
  condition: {
    // 条件，当key为数字时，只使用值作为条件，条件之间使用and连接
    '0': 'ss < 12',
    '12': 'ss > 1'
  }
});
```

## 改语句

```javascript
d.update({
  table: 'xxx', // 表名
  data: {
    // 要更新的字段
    xxx: 'xxx'
  },
  condition: {}, // 条件，使用方式同删语句，支持字符串和对象
});
```

## 查语句

查语句支持的条件较多，参数主要如下:

```javascript
d.find({
  table: 'xxx', // 表名
  condition: {}, // 条件，使用方式同删语句，支持字符串和对象
  alias: {'xxx': 'a'}, // 表的别名对象，会生成AS语句
  field: {
    // 获取的字段，当不传时返回的是table字段对应表的所有字段
    // 如果传了field，会将field里的map和attr里所出现的字段进行合并
    map: {
      'attr_1': 'attr1' // 需要返回的字段和该字段的别名
    },
    attr: ['attr2', 'attr3'] // 需要返回的字段，不带别名
  },
  // field: 'attr_1 as attr1', // field 字段同样支持传字符串进来
  join: {
    // 需要进行连接的表，可传入数组
    table: 'yyy', // 要连接的表名
    type: 'left', // 连接方式，支持right\inner\full\left四种方式，默认为left
    on: { // 连接条件，值可为字符串，即ON语句，如 'id = name' ，亦可为如下对象
      def: 'id = name', // 会用AND的方式与下面对象连接
      condition: {} // 结构如同上面的condition字段
    }
  },
  group: {
    // 分组查询
    attr: 'attr1', // 分组字段，可传入数组
    having: 'COUNT(*)' // 分组筛选条件
  },
  like: {
    // 搜索查询，可传入数组
    value: 'xxx', // 搜索条件
    type: 'front', // 搜索方式，支持front\back\all，默认为all，即在搜索条件前后追加%
    attr: ['ttt', 'vvv'] // 需要进行搜索的字段
  },
  likeType: 'or', // 当搜索条件为数组时的连接方式，支持and\or，默认为or
  order: {
    // 排序，可传入数组
    attr: 'xxx',
    type: 'asc', // 排序方式，支持desc\asc，默认为asc，即升序排序
  },
  limit: 10, // 分页的单页限制
  offset: 100, // 分页的偏移量
});
```

另外，find支持union语句，只要直接传入的参数为数组即可：

```javascript
d.find([{
  table: 'xxx',
  condition: 'id = 123'
}, {
  table: 'yyy',
  condition: 'id < 10'
}])
```

## 协议

MIT
