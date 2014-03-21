# [gulp](http://gulpjs.com/)-msx [![Build Status](https://secure.travis-ci.org/insin/gulp-msx.png?branch=master)](http://travis-ci.org/insin/gulp-msx)

(Based on [gulp-react](https://github.com/sindresorhus/gulp-react))

Precompiles [Mithril](http://lhorie.github.io/mithril/) views which use
[JSX](http://facebook.github.io/react/docs/jsx-in-depth.html) into
JavaScript, using [msx](https://github.com/insin/msx).

### Install

```
npm install --save-dev gulp-msx
```

### Example

```javascript
var gulp = require('gulp')
var msx = require('gulp-msx')

gulp.task('transform-jsx', function() {
  return gulp.src('./src/**/*.jsx')
    .pipe(msx())
    .pipe(gulp.dest('./dist'))
})
```

The JSX `/** @jsx m */` pragma is prepended to `.jsx` files if missing.

`.jsx` files are automatically renamed to `.js` for you, ready for output.

---

MIT Licensed