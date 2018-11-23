var DB = require('./index');

var d = new DB();

/**
 * 测试增语句
 */

test('add module: 增sql', function() {
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
    expect(ret.sql).toBe('INSERT INTO `user` ( `username` , `password` , `email` , `sex` , `description` , `head` ) VALUES ( ? , ? , ? , ? , ? , ? )');
    expect(ret.data).toEqual(['asdasd', 12345, 'asd@as.sdf', 1, 'yoyo', 'asdasd']);
});

test('add module: 增sql，批量添加', function() {
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
    expect(ret.sql).toBe('INSERT INTO `user` ( `username` , `password` , `email` , `sex` , `description` , `head` ) VALUES (? , ? , ? , ? , ? , ?) , (? , ? , ? , ? , ? , ?) , (? , ? , ? , ? , ? , ?)');
    expect(ret.data).toEqual(['asdasd', 12345, 'asd@as.sdf', 1, 'yoyo', 'asdasd', 'qqwwrr', 12345, 'qqwwee@yee.sdf', 0, 'nnn', 'sw', 'hwerwer', 12345, 'asd@hqwe.sdf', 1, 'wetttt', 'asdherjhasd']);
});

/**
* 测试删语句
*/

test('del module: 删sql，条件为字符串', function() {
    var ret = d.del({
        table: 'share',
        condition: 'id = 123'
    });
    expect(ret.sql).toBe('DELETE FROM `share` WHERE id = 123');
    expect(ret.data).toEqual([]);
});

test('del module: 删sql，条件为对象', function() {
    var ret = d.del({
        table: 'share',
        condition: {
            username: 'gasgg',
            create_time: 1322456678112,
            parent_id: 14
        }
    });
    expect(ret.sql).toBe('DELETE FROM `share` WHERE `share`.`username` = ? AND `share`.`create_time` = ? AND `share`.`parent_id` = ?');
    expect(ret.data).toEqual(['gasgg', 1322456678112, 14]);
});

test('del module: 删sql，条件为对象，条件使用or连接', function() {
    var ret = d.del({
        table: 'share',
        condition: [
            {username: 'gasgg'},
            {create_time: 1322456678112},
            {parent_id: 14}
        ]
    });
    expect(ret.sql).toBe('DELETE FROM `share` WHERE `share`.`username` = ? OR `share`.`create_time` = ? OR `share`.`parent_id` = ?');
    expect(ret.data).toEqual(['gasgg', 1322456678112, 14]);
});

test('del module: 删sql，条件为对象，存在对象值为数组', function() {
    var ret = d.del({
        table: 'share',
        condition: {
            id: [12, 22, 55, 66]
        }
    });
    expect(ret.sql).toBe('DELETE FROM `share` WHERE `share`.`id` in (? , ? , ? , ?)');
    expect(ret.data).toEqual([12, 22, 55, 66]);
});

test('del module: 删sql，条件为对象，存在多个对象值为数组', function() {
    var ret = d.del({
        table: 'share',
        condition: {
            id: [12, 22, 55, 66],
            parent_id: [2, 12]
        }
    });
    expect(ret.sql).toBe('DELETE FROM `share` WHERE `share`.`id` in (? , ? , ? , ?) AND `share`.`parent_id` in (? , ?)');
    expect(ret.data).toEqual([12, 22, 55, 66, 2, 12]);
});

test('del module: 删sql，条件为对象，只以对象值作为条件', function() {
    var ret = d.del({
        table: 'share',
        condition: {
            '0': 'id < 12',
            '11': 'id > 1'
        }
    });
    expect(ret.sql).toBe('DELETE FROM `share` WHERE id < 12 AND id > 1');
});

/**
* 测试改语句
*/

test('update module: 改sql，条件为字符串', function() {
    var ret = d.update({
        table: 'share',
        data: {
            username: 'ggsd',
            parent_id: 3434
        },
        condition: 'id = 123'
    });
    expect(ret.sql).toBe('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE id = 123');
    expect(ret.data).toEqual(['ggsd', 3434]);
});

test('update module: 改sql，条件为对象', function() {
    var ret = d.update({
        table: 'share',
        data: {
            username: 'ggsd',
            parent_id: 3434
        },
        condition: {
            username: 'gasgg',
            create_time: 1322456678112,
            parent_id: 14
        }
    });
    expect(ret.sql).toBe('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE `share`.`username` = ? AND `share`.`create_time` = ? AND `share`.`parent_id` = ?');
    expect(ret.data).toEqual(['ggsd', 3434, 'gasgg', 1322456678112, 14]);
});

test('update module: 改sql，条件为对象，存在对象值为数组', function() {
    var ret = d.update({
        table: 'share',
        data: {
            username: 'ggsd',
            parent_id: 3434
        },
        condition: {
            id: [12, 22, 55, 66]
        }
    });
    expect(ret.sql).toBe('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE `share`.`id` in (? , ? , ? , ?)');
    expect(ret.data).toEqual(['ggsd', 3434, 12, 22, 55, 66]);
});

test('update module: 改sql，条件为对象，存在多个对象值为数组', function() {
    var ret = d.update({
        table: 'share',
        data: {
            username: 'ggsd',
            parent_id: 3434
        },
        condition: {
            id: [12, 22, 55, 66],
            parent_id: [2, 12]
        }
    });
    expect(ret.sql).toBe('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE `share`.`id` in (? , ? , ? , ?) AND `share`.`parent_id` in (? , ?)');
    expect(ret.data).toEqual(['ggsd', 3434, 12, 22, 55, 66, 2, 12]);
});

/**
* 测试查语句
*/

test('find module: 查sql，条件为字符串', function() {
    var ret = d.find({
        table: 'share',
        condition: 'id = 123'
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE id = 123');
    expect(ret.data).toEqual([]);
});

test('find module: 查sql，条件为对象', function() {
    var ret = d.find({
        table: 'share',
        condition: {
            username: 'gasgg',
            create_time: 1322456678112,
            parent_id: 14
        }
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE `share`.`username` = ? AND `share`.`create_time` = ? AND `share`.`parent_id` = ?');
    expect(ret.data).toEqual(['gasgg', 1322456678112, 14]);
});

test('find module: 查sql，条件为对象，存在对象值为数组', function() {
    var ret = d.find({
        table: 'share',
        condition: {
            id: [12, 22, 55, 66]
        }
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE `share`.`id` in (? , ? , ? , ?)');
    expect(ret.data).toEqual([12, 22, 55, 66]);
});

test('find module: 查sql，条件为对象，存在多个对象值为数组', function() {
    var ret = d.find({
        table: 'share',
        condition: {
            id: [12, 22, 55, 66],
            parent_id: [2, 12]
        }
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE `share`.`id` in (? , ? , ? , ?) AND `share`.`parent_id` in (? , ?)');
    expect(ret.data).toEqual([12, 22, 55, 66, 2, 12]);
});

test('find module: 查sql，条件为字符串，存在分页', function() {
    var ret = d.find({
        table: 'share',
        offset: 10,
        limit: 20,
        condition: 'id = 123'
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE id = 123 LIMIT ? OFFSET ?');
    expect(ret.data).toEqual([20, 10]);
});

test('find module: 查sql，条件为字符串，存在分页，搜索值为对象', function() {
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
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE id = 123 OR `share`.`username` LIKE "%xxx" OR `share`.`id` LIKE "%xxx" LIMIT ? OFFSET ?');
    expect(ret.data).toEqual([20, 10]);
});

test('find module: 查sql，条件为字符串，存在分页，搜索值为对象数组', function() {
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
            attr: 'create_time'
        }],
        condition: 'id = 123'
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE id = 123 OR `share`.`username` LIKE "%xxx" OR `share`.`id` LIKE "%xxx" OR `share`.`create_time` LIKE "%yyy%" LIMIT ? OFFSET ?');
    expect(ret.data).toEqual([20, 10]);
});

test('find module: 查sql，条件为字符串，排序值为对象数组', function() {
    var ret = d.find({
        table: 'share',
        order: [{
            attr: 'other.username',
            type: 'desc'
        }, {
            attr: 'create_time',
            type: 'asc'
        }],
        condition: 'id = 123'
    });
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE id = 123 ORDER BY `other`.`username` DESC , `share`.`create_time` ASC');
    expect(ret.data).toEqual([]);
});

test('find module: 查sql，使用表别名', function() {
    var ret = d.find({
        table: 'share',
        alias: {
            share: 's'
        },
        condition: 's.id = 123'
    });
    expect(ret.sql).toBe('SELECT * FROM `share` AS `s` WHERE s.id = 123');
    expect(ret.data).toEqual([]);
});

test('find module: 查sql，使用表别名，进行表连接，值为对象数组', function() {
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
            on: {
                def: 'b.username = s.username',
                condition: {
                    a: 'sss'
                }
            }
        }],
        condition: 's.id = 123'
    });
    expect(ret.sql).toBe('SELECT * FROM `share` AS `s` FULL JOIN `user` AS `u` ON u.username = s.username LEFT JOIN `blog` AS `b` ON b.username = s.username AND `share`.`a` = ? WHERE s.id = 123');
    expect(ret.data).toEqual(['sss']);
});

test('find module: 查sql，使用分组', function() {
    var ret = d.find({
        table: 'share',
        group: {
            attr: 'username',
            having: 'COUNT(*) > 10'
        }
    });
    expect(ret.sql).toBe('SELECT * FROM `share` GROUP BY `share`.`username` HAVING COUNT(*) > 10');
    expect(ret.data).toEqual([]);
});

test('find module: 查sql，条件为字符串，使用表别名，进行表连接，获取方式为自定义', function() {
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
    expect(ret.sql).toBe('SELECT `u`.`email` , `u`.`description` , `s`.`id` , `s`.`username` , `u`.`username` AS `linkUsername` FROM `share` AS `s` LEFT JOIN `user` AS `u` ON u.username = s.username WHERE id = 123');
    expect(ret.data).toEqual([]);
});

test('find module: 查sql，字段为字符串', function() {
    var ret = d.find({
        table: 'share',
        field: 'COUNT(*) AS `total`'
    });
    expect(ret.sql).toBe('SELECT COUNT(*) AS `total` FROM `share`');
    expect(ret.data).toEqual([]);
});

test('find module: 查sql，条件为字符串，使用union', function() {
    var ret = d.find([{
        table: 'share',
        condition: 'id = 123'
    }, {
        table: 'share',
        condition: 'id < 10'
    }]);
    expect(ret.sql).toBe('SELECT * FROM `share` WHERE id = 123 UNION SELECT * FROM `share` WHERE id < 10');
    expect(ret.data).toEqual([]);
});
