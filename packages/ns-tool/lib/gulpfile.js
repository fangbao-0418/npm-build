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
    input: getOut('/'),
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
  gulp.src(getSrc('/**/*.less'))
    .pipe(less())
    .pipe(postcss([ autoprefixer() ]))
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

const build = series(['clean', 'copy', 'ts', 'js', 'cleanjsx', 'less', 'dist'])

gulp.on('task_start', (options) => {
  target = options.target
  output = options.output
  build()
})