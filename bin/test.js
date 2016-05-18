var Mocha = require('mocha');
var path = require('path');
var fs = require('fs');

var mocha = new Mocha();
var dir = path.join(__dirname, '../test/');

mocha.addFile(dir + 'test.js');

mocha.run(function(err) {
    process.on('exit', function() {
        process.exit(err);
    });
});
