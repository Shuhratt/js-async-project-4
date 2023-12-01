#!/usr/bin/env node

import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import formatHtml from './utils/formatHtml.js';
import axiosInstance from './utils/axiosInstance.js';

const program = new Command();
const regex = /[^a-zA-Z0-9]/g;

const formatingLink = (text) => text.replaceAll(regex, '-');

program
  .name('page-loader')
  .version('0.0.1')
  .argument('<url>')
  .option('-o, --output <dir>', 'output dir', process.cwd())
  .action(async (url, { output }) => {
    const { host, pathname } = new URL(url);
    const linkOutput = `${host}${pathname}`;
    const nameFileFormat = formatingLink(linkOutput);

    const isDefaultPath = output === process.cwd();
    const pathFull = `${!isDefaultPath ? `${output}` : process.cwd()}`;
    const formatFullName = `${pathFull}/${nameFileFormat}.html`;

    try {
      const { data } = await axiosInstance.get(url);
      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true }); // создаем папку, при recursive=true возращает первый созданный путь к каталогу.
      }
      const html = formatHtml(url, data);
      await writeFile(formatFullName, html); // создание html cтраницы c корректными ресурсами
    } catch (err) {
      throw err;
    }
  });

program.parse();
