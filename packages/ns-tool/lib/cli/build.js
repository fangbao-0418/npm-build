#!/usr/bin/env node

const { program } = require('commander');
const gulp = require('gulp')
const { pathInfo }  = require('../utils/projectHelper')

program
  .option('--target <target>', 'target')
  .option('--output <output>', 'output')
  .option('--dist <dist>', 'dist');

program.parse();

const options = program.opts();

require('../gulpfile')

const target = options.target || pathInfo.target
const output = options.output || pathInfo.output
const dist = options.dist || pathInfo.dist

gulp.emit('task_start', {
  target,
  output,
  dist
})