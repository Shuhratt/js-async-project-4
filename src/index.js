#!/usr/bin/env node

import axios from 'axios';
import { Command } from 'commander';
import fs from 'fs/promises';
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
    const formatFullName = `${formating}.html`;
    axios
      .get(url)
      .then(({ data }) => {
        fs.writeFile(formatFullName, data)
          .then((data) => {
            console.log(`Файл успешно создан в ${process.cwd()}`);
          })
          .catch((err) => console.err(err));
      })
      .catch((err) => console.error(err));
  });

program.parse();
