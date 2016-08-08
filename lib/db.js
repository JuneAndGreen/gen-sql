/**
 * sql语句生成器
 *
 * 此工具用于生成sql语句，返回值只有拼装好的sql语句
 * @author: june_01
 */
'use strict';

var _ = require('./util');

/**
 * 包装error对象
 */
const codeMap = {
  8400: '参数错误'
};
function getError(code, table, calleeName) {
  let msg = codeMap[code] || '未知错误';
  throw new Error(`在执行生成表${table}的${calleeName}语句时，出现了${msg}`);
}

/**
 * 判断是否是字符串、数字、布尔值、对象、数组，时间对象
 */
var plainObject = {};
function isString(str) {
  return plainObject.toString.call(str).toLowerCase() === '[object string]';
}
function isNumber(num) {
  return plainObject.toString.call(num).toLowerCase() === '[object number]';
}
function isBoolean(bool) {
  return plainObject.toString.call(bool).toLowerCase() === '[object boolean]';
}
function isObject(obj) {
  return plainObject.toString.call(obj).toLowerCase() === '[object object]';
}
function isArray(arr) {
  return plainObject.toString.call(arr).toLowerCase() === '[object array]';
}
function isDate(arr) {
  return plainObject.toString.call(arr).toLowerCase() === '[object date]';
}

/**
 * 判断是否原始值，只允许字符串、数字、布尔值、时间对象和null
 */
function isOrigin(val) {
  return isString(val) || isNumber(val) || isBoolean(val) || isDate(val) || val === null;
}

/**
 * 生成反查map
 */
function reverseMap(map) {
  if(!map || !isObject(map)) return;

  let tmpMap = {};
  let keys = Object.keys(map);
  for(let key of keys) {
    let table = map[key];
    tmpMap[key] = tmpMap[key] || {};
    let tmpTable = tmpMap[key];

    let attrs = Object.keys(table);
    for(let attr of attrs) {
      tmpTable[table[attr]] = attr;
    }
  }

  return tmpMap;
}

/**
 * 构造条件字符串
 */
function constructCondition(stmt, table, darr) {
  let condition = [];
  if(isString(stmt)) {
    // 字符串条件
    condition = stmt;
  } else if(isArray(stmt)) {
    // 条件对象
    for(let stmtItem of stmt) {
      let conditionItem = [];
      let keys = Object.keys(stmtItem);
      for(let key of keys) {
        // 遍历条件
        let allkey = key;
        let keyArr = key.split('.');
        let keyTable = `\`${table}\``;
        if(keyArr.length === 2) {
          // 针对不同表的字段加表前缀
          key = keyArr[1];
          keyTable = keyArr[0];
        }

        let itm = stmtItem[allkey];
        let dbkey = _.toUnderline(key);
        if(isOrigin(itm)) {
          // 值类型
          darr.push(itm);
          conditionItem.push(`${keyTable}.${dbkey} = ?`);
        } else if(isArray(itm)) {
          // 数组类型
          let fragment = [];
          for(let val of itm) {
            darr.push(val);
            fragment.push('?');
          }
          fragment = fragment.join(' , ');
          conditionItem.push(`${keyTable}.${dbkey} in (${fragment})`);
          continue;
        } else {
          // 其他
          continue;
        }
      }
      condition.push(conditionItem.join(' AND '));
    }
    condition = condition.join(' OR ');
  } else {
    // 其他
    return getError(8400, table, '生成条件对象');
  }

  return condition;
}

class GenSql {
  constructor() {}
  /**
   * 生成增语句
   */
  add(obj) {
    let data = obj.data; // 要添加的数据，可为数组
    let table = obj.table; // 表名

    if(!data || (!isArray(data) && !isObject(data)) || !table) return getError(8400, table, 'add');
    data = isArray(data) ? data : [data];

    let name = []; // 存放需插入字段名
    let dbName = []; // 存放需插入的数据库字段名
  	let q = []; // 存放需要插入的值
    let attrs = Object.keys(data[0]);
    let darr = []; // 插入数据

    for(let attr of attrs) {
      // 遍历添加字段
      name.push(attr);
      dbName.push(_.toUnderline(attr));
    }

    for(let itm of data) {
      // 获取插值
      let tmpQ  = [];
      for(let attr of name) {
        if(!isOrigin(itm[attr])) {
          // 存在非原始类型的值
          return getError(8401, table, 'add');
        }
        tmpQ.push('?');
        darr.push(itm[attr]);
      }
      q.push(tmpQ.join(' , '));
    }

  	dbName = dbName.join(' , ');
  	if(q.length > 1) {
      q = '(' + q.join(') , (') + ')';
    } else {
      q = `( ${q[0]} )`;
    }

    return {
      sql: `INSERT INTO \`${table}\` ( ${dbName} ) VALUES ${q}`,
      data: darr
    };
  }
  /**
   * 生成删语句
   */
  del(obj) {
    let table = obj.table; // 表名
    let stmt = isObject(obj.condition) ? [obj.condition] : obj.condition; // 条件

    if(!table) return getError(8400, table, 'del');

    let condition; // 存放条件
    let darr = []; // 插入数据

    // 条件
    if(!stmt) condition = '';
    else {
      condition = constructCondition(stmt, table, darr);
      condition = `WHERE ${condition}`;
    }

    return {
      sql: `DELETE FROM \`${table}\` ${condition}`,
      data: darr
    };
  }
  /**
   * 生成改语句
   */
  update(obj) {
    let data = obj.data; // 要修改的数据
    let table = obj.table; // 表名
    let stmt = isObject(obj.condition) ? [obj.condition] : obj.condition; // 条件

    if(!data || !isObject(data) || !table) return getError(8400, table, 'update');

    let name = [];
  	let condition; // 获取条件
    let darr = []; // 插入数据

    let keys = Object.keys(data);
    if(!keys.length) return getError(8400, table, 'update');
    
    // 更新字段
    for(let key of keys) {
      let itm = data[key];
      let dbkey = _.toUnderline(key);

      if(isOrigin(itm)) {
        // 值类型
        darr.push(itm);
        name.push(`${dbkey} = ?`);
      } else {
        // 其他
        continue;
      }
    }
  	name.join(' , ');

    // 条件
    if(!stmt) condition = '';
    else {
      condition = constructCondition(stmt, table, darr);
      condition = `WHERE ${condition}`;
    }

    return {
      sql: `UPDATE \`${table}\` SET ${name} ${condition}`,
      data: darr
    };
  }
  /**
   * 生成获取语句
   */
  find(obj) {
    if(isArray(obj)) {
      // 针对传入数组，做union操作
      let sqlArr = [];
      let dataArr = [];
      for(let item of obj) {
        let ret = this.find(item);
        sqlArr.push(ret.sql);
        dataArr = dataArr.concat(ret.data);
      }
      return {
        sql: sqlArr.join(' UNION '),
        data: dataArr
      };
    }

    let table = obj.table; // 表名
    let stmt = !obj.condition ? [] : isObject(obj.condition) ? [obj.condition] : obj.condition; // 条件
    let alias = obj.alias; // 表的别名映射

    // 取字段，值只可为对象
    // 其对象结构类似{map:{'xx_yy': 'xxYy'}, attrs: ['xx', 'yy']}
    let field = obj.field;

    // 连接，值可为对象或对象数组
    // 其对象结构类似{table: 'xxx', type: 'right|inner|full|left(默认值，左外连接)', on: 'xxx'}
    let join = obj.join;
    join = isObject(join) ? [join] : join;

    // 分组，值只可为对象
    // 器对象结构类似{attr: 'xxx'|['xxx'], having: 'sss'}
    let group = obj.group;

    // 搜索，值可为对象或对象数组
    // 其对象结构类似{value: 'xxx', type: 'front|back|all(默认值，前后补%)', attr: 'xxx'|['xxx']}
    let like = obj.like;
    like = isObject(like) ? [like] : like;
    let likeType = obj.likeType && obj.likeType.toLowerCase() === 'and' ? ' AND ' : ' OR '; // 搜索的连接方式，默认使用or

    // 排序，值可为对象或对象数组
    // 其对象结构类似{attr: 'xxx', type: 'desc|asc(默认值，升序)'}
    let order = obj.order;
    order = isObject(order) ? [order] : order;

    // 分页
    let limit = obj.limit; // 单页数量
    let offset = obj.offset; // 偏移量

    let name = [];
    let condition = []; // 获取条件
    let darr = []; // 插入数据

    // 字段
    if(field) {
      // 使用传入的字段
      let attrs = field.attr;
      let map = field.map;

      if(isArray(attrs)) {
        // 无别名字段
        name = name.concat(attrs);
      }

      if(isObject(map)) {
        // 有别名字段
        let keys = Object.keys(map);
        for(let key of keys) {
          name.push(`${key} AS "${map[key]}"`);
        }
      }
    } else {
      // 选择所有字段
      name.push('*');
    }
    name = name.join(' , ');

    let sql = `SELECT ${name} FROM \`${table}\``;

    // 主表别名
    if(alias && alias[table]) {
      sql += ` AS ${alias[table]}`;
    }

    // 连接
    if(isArray(join)) {
      let joinArr = [];
      for(let itm of join) {
        // 遍历join对象
        let joinTable = itm.table;
        let on = itm.on;
        let type = itm.type && itm.type.toLowerCase() || 'left';
        type = type === 'right' ? 'RIGHT JOIN' : type === 'inner' ? 'INNER JOIN' : type === 'full' ? 'FULL JOIN' : 'LEFT JOIN';

        let fragment = `${type} \`${joinTable}\``;
        if(alias && alias[joinTable]) fragment += ` AS ${alias[joinTable]}`; // 连接表的别名

        // 连接条件
        if(isString(on)) {
          // 字符串条件
          fragment += ` ON ${on}`;
        } else if(isObject(on)) {
          // 对象条件
          let tmpOnArr = [];
          if(on.def && isString(on.def)) tmpOnArr.push(on.def);
          if(on.condition) {
            on.condition = isObject(on.condition) ? [on.condition] : on.condition;
            tmpOnArr.push(constructCondition(on.condition, table, darr));
          }

          tmpOnArr = tmpOnArr.join(' AND ');

          fragment += ` ON ${tmpOnArr}`;
        }

        joinArr.push(fragment);
      }
      joinArr = joinArr.join(' ');
      if(joinArr) {
        sql += ` ${joinArr}`;
      }
    }

    // 条件
    condition = constructCondition(stmt, table, darr);

    // 搜索
    if(isArray(like)) {
      condition = condition ? [condition] : [];
      for(let itm of like) {
        let attrs = itm.attr;
        let type = (itm.type || 'all').toLowerCase();
        let val = itm.value;
        let likeCondition = [];
        attrs = isArray(attrs) ? attrs : [attrs];

        for(let attr of attrs) {
          // 遍历like对象中的attr字段
          let dbattr = _.toUnderline(attr);
          let attrArr = attr.split('.');
          let attrTable = `\`${table}\``;
          if(attrArr.length === 2) {
            // 针对不同表的字段加表前缀
            attr = attrArr[1];
            attrTable = attrArr[0];
          }

          let fragment = type === 'front' ? `%${val}` : type === 'back' ? `${val}%` : `%${val}%`;
          likeCondition.push(`${attrTable}.${dbattr} LIKE "${fragment}"`);
        }
        condition.push(likeCondition.join(likeType));
      }
      condition = condition.join(likeType);
    }

    if(condition && isString(condition)) {
  		sql += ` WHERE ${condition}`;
  	}

    // 分组
    if(isObject(group)) {
      let attrs = group.attr;
      let having = group.having;
      attrs = isArray(attrs) ? attrs : [attrs];
      attrs = attrs.join(' , ');
      sql += ` GROUP BY ${attrs}`;
      if(having) {
        sql += ` HAVING ${having}`;
      }
    }

    // 排序
    if(isArray(order)) {
      let orderArr = [];
      for(let itm of order) {
        // 遍历order对象
        let attr = itm.attr;
        attr = _.toUnderline(attr);
        let type = itm.type && itm.type.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        let attrArr = attr.split('.');
        let attrTable = `\`${table}\``;
        if(attrArr.length === 2) {
          // 针对不同表的字段加表前缀
          attr = attrArr[1];
          attrTable = attrArr[0];
        }

        orderArr.push(`${attrTable}.${attr} ${type}`);
      }
      orderArr = orderArr.join(' , ');
      if(orderArr) {
        sql += ` ORDER BY ${orderArr}`;
      }
    }

    // 分页
  	if(isNumber(limit)) {
      darr.push(limit);
      sql += ` LIMIT ?`;
    }
    if(isNumber(offset)) {
      darr.push(offset);
      sql += ` OFFSET ?`
    }

    return {
      sql,
      data: darr
    };
  }
};

module.exports = GenSql;
