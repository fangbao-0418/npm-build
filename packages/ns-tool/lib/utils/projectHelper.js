const path = require('path')
const fs = require('fs')
const __cwd = process.cwd()

const TSCONFIGJSON = 'tsconfig.json'

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
  target: getProjectPath('./target'),
  output: getProjectPath('./output'),
  tsconfigFile: projectFileExists(TSCONFIGJSON) ? getProjectPath(TSCONFIGJSON) : getPath(TSCONFIGJSON)
}

const appName = projectFileExists('package.json') ? require(getProjectPath('package.json')).name : 'my-library'

module.exports = {
  pathInfo,
  getProjectPath,
  appName
}