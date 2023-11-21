#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();
const regex = /[^a-zA-Z0-9]/g;

program
  .name('page-loader')
  .version('0.0.1')
  .argument('<url>')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action((url, options) => {
    const { host, pathname } = new URL(url);
    const linkOutput = `${host}${pathname}`;
    const formating = linkOutput.replaceAll(regex, '-');


    console.log(options.output);
    console.log(`${formating}.html`);
  });

program.parse();