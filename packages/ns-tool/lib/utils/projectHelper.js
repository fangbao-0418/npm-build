const path = require('path')
const fs = require('fs')
const __cwd = process.cwd()

const TSCONFIGJSON = 'tsconfig.json'
const BABELRC = '.babelrc'

function getProjectPath(...filePath) {
  return path.join(__cwd, ...filePath);
}

function getPath(...filePath) {
  return path.join(__dirname, '../../', ...filePath);
}

function projectFileExists (...path) {
  return fs.existsSync(getProjectPath(...path))
}

const pathInfo = {
  target: getProjectPath('./src'),
  output: getProjectPath('./'),
  tsconfigFile: projectFileExists(TSCONFIGJSON) ? getProjectPath(TSCONFIGJSON) : getPath(TSCONFIGJSON),
  babelConfigFile: projectFileExists(BABELRC) ? getProjectPath(BABELRC) : getPath(BABELRC)
}

const appName = projectFileExists('package.json') ? require(getProjectPath('package.json')).name : 'my-library'

module.exports = {
  pathInfo,
  getProjectPath,
  appName
}