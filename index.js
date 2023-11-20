#!/usr/bin/env node

import { Command } from 'commander';
import process from 'process';

const program = new Command();

program
  .name('page-loader')
  .version('0.0.1')
  .argument('<url>')
  .option('-o, --output [dir]', 'output dir', 'home/user/current-dir')
  .action((url, options) => {
    console.log(options.output);
    console.log(url)
  });

program.parse();

const options = program.opts();
