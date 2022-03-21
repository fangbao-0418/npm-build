#!/usr/bin/env node

const { program } = require('commander');
const gulp = require('gulp')
const { pathInfo }  = require('../utils/projectHelper')

program
  .option('--target <target>', 'target')
  .option('--output <output>', 'output');

program.parse();

const options = program.opts();

require('../gulpfile')

const target = options.target || pathInfo.target
const output = options.output || pathInfo.output

gulp.emit('task_start', {
  target,
  output,
})