#!/usr/bin/env node

import { Command } from 'commander';
import process from 'process';

const program = new Command();

program.name('page-loader').version('0.0.1');

program
  .option('-v, --version', 'output the version number')
  .option(
    '-o, --output [dir] <url>',
    'output dir (default: "/home/user/current-dir")',
    'home/user/current-dir',
  )
  .option('-h, --help', 'display help for command');

//program.name('open').action((str, option) => {});

program.parse();
