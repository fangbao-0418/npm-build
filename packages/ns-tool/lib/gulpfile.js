const gulp = require('gulp')
const { series } = gulp
const rimraf = require('rimraf')
const less = require('gulp-less');
const babel = require('gulp-babel')
const rollup = require('rollup')
const { pathInfo, appName, getProjectPath } = require('./utils/projectHelper')
const { uglify } = require('rollup-plugin-uglify')

let target = ''
let output = ''

function getSrc (path = '') {
  return target + path
}

function getOut (path = '') {
  return output + path
}

gulp.task('dist', async function (done) {
  const resolve = require('rollup-plugin-node-resolve')
  const commonjs = require('rollup-plugin-commonjs')
  const bundle = await rollup.rollup({
    input: getOut('/lib'),
    external: [
      'react'
    ],
    plugins: [
      resolve(),
      commonjs(),
      uglify()
    ]
  })
  await bundle.write({
    file: getOut(`/dist/${appName}.js`),
    format: 'umd',
    name: 'library',
    exports: 'named',
    globals: {
      'react': 'React'
    }
  });
  done()
})

gulp.task('less', function (cb) {
  var postcss = require('gulp-postcss')
  var autoprefixer = require('autoprefixer')

  function callback(file) {
    const plugins = [
      autoprefixer(),
    ]
    if (/m(odule)?\.less/.test(file.extname)) {
      plugins.push(
        require('postcss-modules')
      )
    }
    return {
      plugins
    }
  }

  gulp.src(getSrc('/**/*.less'))
    .pipe(less({
      javascriptEnabled: true
    }))
    .pipe(postcss(callback))
    .pipe(gulp.dest(getOut('/lib')))
    .on('end', cb)
})

// 编译ts
gulp.task('ts', function (cb) {
  const ts = require('gulp-typescript')
  var tsProject = ts.createProject({
    declaration: true,
    rootDir: getProjectPath('./'),
    lib: [
      'es2015',
      'DOM'
    ],
    allowSyntheticDefaultImports: true,
    jsx: 'react',
    esModuleInterop: true,
    moduleResolution: "Node",
    skipLibCheck: true,
    baseUrl: getProjectPath('./'),
    project: getProjectPath('./'),
  })

  gulp.src(getSrc('/**/*.ts?(x)'), {
    cwd: getProjectPath('./'),
  })
    .pipe(tsProject())
    .on('error', (err) => {
      console.log("::compile typescript fail::")
      console.log(err)
    })
    .pipe(gulp.dest(getOut('/lib')))
    .on('end', cb)
})

gulp.task('copy', function (cb) {
  gulp.src([
   '**/*'
  ], {
    ignore: [
      '**/*.ts',
      '**/*.tsx'
    ],
    cwd: target
  })
    .pipe(gulp.dest(getOut('/lib')))
    .on('end', cb)
})

// 编译js
gulp.task('js', function (cb) {
  gulp.src(
    [
      '**/*.js',
      '**/*.jsx'
    ],
    {
      cwd: getOut('/lib')
    }
  )
    .pipe(babel(
      {
        configFile: pathInfo.babelConfigFile,
        cwd: getProjectPath()
      }
    ))
    .pipe(gulp.dest(getOut('/lib')))
    .on('end', cb)
})

// 删除jsx
gulp.task('cleanjsx', function (cb) {
  rimraf.sync(getOut('/lib/**/*.jsx'))
  cb()
})

gulp.task('clean', function (cb) {
  rimraf.sync(getOut('/lib'))
  rimraf.sync(getOut('/es'))
  rimraf.sync(getOut('/dist'))
  cb()
})

gulp.on('task_start', (options) => {
  target = options.target
  output = options.output
  dist = !!options.dist
  watch = !!options.watch
  if (watch) {
    const buildJs = series(['copy', 'ts', 'js', 'cleanjsx'])
    const buildCss = series(['copy', 'less'])
    gulp.watch([`${target}/**/*.tsx`, `${target}/**/*.ts`, `${target}/**/*.js`, `${target}/**/*.jsx`], (cb) => {
      buildJs()
      console.log('\x1B[32m%s\x1B[39m', 'compile javascript ok')
      cb()
    })
    gulp.watch([`${target}/**/*.less`], (cb) => {
      buildCss()
      console.log('\x1B[32m%s\x1B[39m', 'compile css ok')
      cb()
    })
  }
  if (dist) {
    const build = series(['clean', 'copy', 'ts', 'js', 'cleanjsx', 'less', 'dist'])
    build()
  } else {
    const build = series(['clean', 'copy', 'ts', 'js', 'cleanjsx', 'less'])
    build()
  }
})