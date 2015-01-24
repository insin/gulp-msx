'use strict';

var path = require('path')

var gutil = require('gulp-util')
var msx = require('msx')
var through = require('through2')

module.exports = function(name, options) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file)
      return cb()
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-msx', 'Streaming not supported'))
      return cb()
    }

    var str = file.contents.toString()

    if (path.extname(file.path) === '.jsx' && !(/\*\s*@jsx/.test(str))) {
      str = '/** @jsx m */\n' + str
    }

    try {
      file.contents = new Buffer(msx.transform(str, options))
      file.path = gutil.replaceExtension(file.path, '.js')
      this.push(file)
    }
    catch (err) {
      err.fileName = file.path
      this.emit('error', new gutil.PluginError('gulp-msx',
        gutil.colors.magenta(path.relative(file.cwd, file.path)) + ' ' + err.message))
    }

    cb()
  })
}
