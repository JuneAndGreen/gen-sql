var Mocha = require('mocha');
var path = require('path');
var fs = require('fs');

var mocha = new Mocha();
var dir = path.join(__dirname, '../test/');

mocha.addFile(dir + 'testAdd.js');
mocha.addFile(dir + 'testDel.js');
mocha.addFile(dir + 'testUpdate.js');
mocha.addFile(dir + 'testFind.js');

mocha.run(function(err) {
    process.on('exit', function() {
        process.exit(err);
    });
});
