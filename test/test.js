var assert = require('assert');
var should = require('should');

var DB = require('../lib/db');

var d = new DB();

/**
 * 测试增语句
 */

describe('add module', function() {

    describe('action0', function() {
        it('增sql', function() {
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
            ret.sql.should.be.eql('INSERT INTO `user` ( `username` , `password` , `email` , `sex` , `description` , `head` ) VALUES ( ? , ? , ? , ? , ? , ? )');
            ret.data.should.be.eql(['asdasd', 12345, 'asd@as.sdf', 1, 'yoyo', 'asdasd']);
        });
    });

    describe('action1', function() {
        it('增sql，批量添加', function() {
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
            ret.sql.should.be.eql('INSERT INTO `user` ( `username` , `password` , `email` , `sex` , `description` , `head` ) VALUES (? , ? , ? , ? , ? , ?) , (? , ? , ? , ? , ? , ?) , (? , ? , ? , ? , ? , ?)');
            ret.data.should.be.eql(['asdasd', 12345, 'asd@as.sdf', 1, 'yoyo', 'asdasd', 'qqwwrr', 12345, 'qqwwee@yee.sdf', 0, 'nnn', 'sw', 'hwerwer', 12345, 'asd@hqwe.sdf', 1, 'wetttt', 'asdherjhasd']);
        });
    });

});

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
            ret.sql.should.be.eql('DELETE FROM `share` WHERE id = 123');
            ret.data.should.be.eql([]);
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
            ret.sql.should.be.eql('DELETE FROM `share` WHERE `share`.`username` = ? AND `share`.`create_time` = ? AND `share`.`parent_id` = ?');
            ret.data.should.be.eql(['gasgg', 1322456678112, 14]);
        });
    });

    describe('action2', function() {
        it('删sql，条件为对象，条件使用or连接', function() {
            var ret = d.del({
                table: 'share',
                condition: [
                    {username: 'gasgg'},
                    {createTime: 1322456678112},
                    {parentId: 14}
                ]
            });
            ret.sql.should.be.eql('DELETE FROM `share` WHERE `share`.`username` = ? OR `share`.`create_time` = ? OR `share`.`parent_id` = ?');
            ret.data.should.be.eql(['gasgg', 1322456678112, 14]);
        });
    });

    describe('action3', function() {
        it('删sql，条件为对象，存在对象值为数组', function() {
            var ret = d.del({
                table: 'share',
                condition: {
                    id: [12, 22, 55, 66]
                }
            });
            ret.sql.should.be.eql('DELETE FROM `share` WHERE `share`.`id` in (? , ? , ? , ?)');
            ret.data.should.be.eql([12, 22, 55, 66]);
        });
    });

    describe('action4', function() {
        it('删sql，条件为对象，存在多个对象值为数组', function() {
            var ret = d.del({
                table: 'share',
                condition: {
                    id: [12, 22, 55, 66],
                    parentId: [002, 12]
                }
            });
            ret.sql.should.be.eql('DELETE FROM `share` WHERE `share`.`id` in (? , ? , ? , ?) AND `share`.`parent_id` in (? , ?)');
            ret.data.should.be.eql([12, 22, 55, 66, 2, 12]);
        });
    });

});


/**
* 测试改语句
*/

describe('update module', function() {

    describe('action0', function() {
        it('改sql，条件为字符串', function() {
            var ret = d.update({
                table: 'share',
                data: {
                    username: 'ggsd',
                    parentId: 3434
                },
                condition: 'id = 123'
            });
            ret.sql.should.be.eql('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE id = 123');
            ret.data.should.be.eql(['ggsd', 3434]);
        });
    });

    describe('action1', function() {
        it('改sql，条件为对象', function() {
            var ret = d.update({
                table: 'share',
                data: {
                    username: 'ggsd',
                    parentId: 3434
                },
                condition: {
                    username: 'gasgg',
                    createTime: 1322456678112,
                    parentId: 14
                }
            });
            ret.sql.should.be.eql('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE `share`.`username` = ? AND `share`.`create_time` = ? AND `share`.`parent_id` = ?');
            ret.data.should.be.eql(['ggsd', 3434, 'gasgg', 1322456678112, 14]);
        });
    });

    describe('action2', function() {
        it('改sql，条件为对象，存在对象值为数组', function() {
            var ret = d.update({
                table: 'share',
                data: {
                    username: 'ggsd',
                    parentId: 3434
                },
                condition: {
                    id: [12, 22, 55, 66]
                }
            });
            ret.sql.should.be.eql('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE `share`.`id` in (? , ? , ? , ?)');
            ret.data.should.be.eql(['ggsd', 3434, 12, 22, 55, 66]);
        });
    });

    describe('action3', function() {
        it('改sql，条件为对象，存在多个对象值为数组', function() {
            var ret = d.update({
                table: 'share',
                data: {
                    username: 'ggsd',
                    parentId: 3434
                },
                condition: {
                    id: [12, 22, 55, 66],
                    parentId: [002, 12]
                }
            });
            ret.sql.should.be.eql('UPDATE `share` SET `username` = ? , `parent_id` = ? WHERE `share`.`id` in (? , ? , ? , ?) AND `share`.`parent_id` in (? , ?)');
            ret.data.should.be.eql(['ggsd', 3434, 12, 22, 55, 66, 2, 12]);
        });
    });

});


/**
* 测试查语句
*/

describe('find module', function() {

    describe('action0', function() {
        it('查sql，条件为字符串', function() {
            var ret = d.find({
                table: 'share',
                condition: 'id = 123'
            });
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE id = 123');
            ret.data.should.be.eql([]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE `share`.`username` = ? AND `share`.`create_time` = ? AND `share`.`parent_id` = ?');
            ret.data.should.be.eql(['gasgg', 1322456678112, 14]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE `share`.`id` in (? , ? , ? , ?)');
            ret.data.should.be.eql([12, 22, 55, 66]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE `share`.`id` in (? , ? , ? , ?) AND `share`.`parent_id` in (? , ?)');
            ret.data.should.be.eql([12, 22, 55, 66, 2, 12]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE id = 123 LIMIT ? OFFSET ?');
            ret.data.should.be.eql([20, 10]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE id = 123 OR `share`.`username` LIKE "%xxx" OR `share`.`id` LIKE "%xxx" LIMIT ? OFFSET ?');
            ret.data.should.be.eql([20, 10]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE id = 123 OR `share`.`username` LIKE "%xxx" OR `share`.`id` LIKE "%xxx" OR `share`.`create_time` LIKE "%yyy%" LIMIT ? OFFSET ?');
            ret.data.should.be.eql([20, 10]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE id = 123 ORDER BY `other`.`username` DESC , `share`.`create_time` ASC');
            ret.data.should.be.eql([]);
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
            ret.sql.should.be.eql('SELECT * FROM `share` AS `s` WHERE s.id = 123');
            ret.data.should.be.eql([]);
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
                    on: {
                        def: 'b.username = s.username',
                        condition: {
                            a: 'sss'
                        }
                    }
                }],
                condition: 's.id = 123'
            });
            ret.sql.should.be.eql('SELECT * FROM `share` AS `s` FULL JOIN `user` AS `u` ON u.username = s.username LEFT JOIN `blog` AS `b` ON b.username = s.username AND `share`.`a` = ? WHERE s.id = 123');
            ret.data.should.be.eql(['sss']);
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
            ret.sql.should.be.eql('SELECT * FROM `share` GROUP BY `share`.`username` HAVING COUNT(*) > 10');
            ret.data.should.be.eql([]);
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
            ret.sql.should.be.eql('SELECT `u`.`email` , `u`.`description` , `s`.`id` , `s`.`username` , `u`.`username` AS `linkUsername` FROM `share` AS `s` LEFT JOIN `user` AS `u` ON u.username = s.username WHERE id = 123');
            ret.data.should.be.eql([]);
        });
    });

    describe('action12', function() {
        it('查sql，字段为字符串', function() {
            var ret = d.find({
                table: 'share',
                field: 'COUNT(*) AS `total`'
            });
            ret.sql.should.be.eql('SELECT COUNT(*) AS `total` FROM `share`');
            ret.data.should.be.eql([]);
        });
    });

    describe('action13', function() {
        it('查sql，条件为字符串，使用union', function() {
            var ret = d.find([{
                table: 'share',
                condition: 'id = 123'
            }, {
                table: 'share',
                condition: 'id < 10'
            }]);
            ret.sql.should.be.eql('SELECT * FROM `share` WHERE id = 123 UNION SELECT * FROM `share` WHERE id < 10');
            ret.data.should.be.eql([]);
        });
    });

});
