var gutil = require('gulp-util')
var test = require('tape').test

var msx = require('./index')

var testFileContents = [
  '/** @jsx m */'
, 'hello.view = function(ctrl) {'
, '  return <div id="test">Hello {ctrl.name}</div>'
, '}'
]

var expectedTransformedContents = [
  '/** @jsx m */'
, 'hello.view = function(ctrl) {'
, '  return m("div", {id:"test"}, ["Hello ", ctrl.name])'
, '}'
]

function streamTest(filename, contents, onData) {
  var stream = msx()
  stream.on('data', onData)
  stream.write(new gutil.File({
    path: filename
  , contents: new Buffer(contents)
  }))
}

test('basic transformation', function(t) {
  t.plan(2)
  streamTest('fixture.jsx', testFileContents.join('\n'), function(file) {
    t.equal(file.relative, 'fixture.js', '.jsx file was renamed to .js in the stream')
    t.equal(file.contents.toString(),
            expectedTransformedContents.join('\n'),
            'tags were transformed to m() function calls')
  })
})

test('adds missing JSX pragma for .jsx files', function(t) {
  t.plan(2)
  streamTest('fixture.jsx', testFileContents.slice(1).join('\n'), function(file) {
    t.equal(file.relative, 'fixture.js', '.jsx file was renamed to .js in the stream')
    t.equal(file.contents.toString(),
            expectedTransformedContents.join('\n'),
            'JSX pragma was added and tags were transformed to m() function calls')
  })
})

test('detects multi-line JSX pragma', function(t) {
  t.plan(2)
  var pragma = [
    '/**',
    ' * Test comment',
    ' * @jsx m',
    ' */'
  ]
  var contents = pragma.concat(testFileContents.slice(1))
  var expected = pragma.concat(expectedTransformedContents.slice(1))
  streamTest('fixture.js', contents.join('\n'), function(file) {
    t.equal(file.relative, 'fixture.js', '.js filename was untouched')
    t.equal(file.contents.toString(),
            expected.join('\n'),
            'no additional JSX pragma was added and tags were transformed to m() function calls')
  })
})
