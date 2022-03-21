const spawn = require('cross-spawn');
const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
var chalk = require('chalk');
program.parse(process.argv);
const templateName = program.args?.[0] || 'ant-template'

function init () {
  const appPath = process.cwd();
  const command = 'yarnpkg';
  let args;
  const dependencies = ['ant-template']
  args = ['add', '--cwd', process.cwd(), '--exact'];
  [].push.apply(args, dependencies);
  
  spawn.sync(command, args, { stdio: 'inherit' });
  
  const templatePath = path.dirname(
    require.resolve(`${templateName}/package.json`, { paths: [appPath] })
  );

  const templateDir = path.join(templatePath, 'template');
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
    spawn.sync(command, ['install'], {
      stdio: 'inherit',
    });
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templateDir)}`
    );
    return;
  }
}

init();