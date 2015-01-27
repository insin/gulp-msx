var gutil = require('gulp-util')
var test = require('tape').test

var msx = require('./index')

var basicTestContents = [
  'hello.view = function(ctrl) {'
, '  return <div id="test">Hello {ctrl.name}</div>'
, '}'
].join('\n')

var basicTestExpected = [
  'hello.view = function(ctrl) {'
, '  return {tag: "div", attrs: {id:"test"}, children: ["Hello ",ctrl.name]}'
, '}'
].join('\n')

var testOptionsContents = [
  'hello.view = ctrl => {'
, '  var {name} = ctrl'
, '  return <div id="test">{`Hello ${name}`}</div>'
, '}'
].join('\n')

var expectedOptionsOutput = [
  'hello.view = function(ctrl)  {'
, '  var $__0=  ctrl,name=$__0.name'
, '  return m("div", {id:"test"}, [("Hello " + name)])'
, '}'
].join('\n')

function streamTest(filename, contents, onData, options) {
  var stream = msx(options)
  stream.on('data', onData)
  stream.write(new gutil.File({
    path: filename
  , contents: new Buffer(contents)
  }))
}

test('basic transformation', function(t) {
  t.plan(2)
  streamTest('fixture.jsx', basicTestContents, function(file) {
    t.equal(file.relative, 'fixture.js', '.jsx file was renamed to .js in the stream')
    t.equal(file.contents.toString(),
            basicTestExpected,
            'tags were transformed to raw virtual DOM objects')
  })
})

test('passing options', function(t) {
  t.plan(1)
  streamTest('fixture.jsx', testOptionsContents, function(file) {
    t.equal(file.contents.toString(),
            expectedOptionsOutput,
            'options were passed to msx.transform()')
  }, {harmony: true, precompile: false})
})