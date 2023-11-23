#!/usr/bin/env node

import axios from 'axios';
import https from 'https';
import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import fs from 'fs';

const program = new Command();
const regex = /[^a-zA-Z0-9]/g;

const formatingLink = (text) => text.replaceAll(regex, '-');

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

program
  .name('page-loader')
  .version('0.0.1')
  .argument('<url>')
  .option('-o, --output <dir>', 'output dir', process.cwd())
  .action(async (url, { output }) => {
    const { host, pathname } = new URL(url);
    const linkOutput = `${host}${pathname}`;
    const nameFileFormat = formatingLink(linkOutput);
    const hostFormat = formatingLink(host);
    // ru-hexlet-io-courses_files   - pathFull + _file

    const isDefaultPath = output === process.cwd();
    const pathFull = `${!isDefaultPath ? `${output}` : process.cwd()}`;
    const formatFullName = `${pathFull}/${nameFileFormat}.html`;

    try {
      const { data } = await axiosInstance.get(url);
      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true }); // создаем папку, при recursive=true возращает первый созданный путь к каталогу.
      }
      await writeFile(formatFullName, data);
      console.info(`Файл успешно создан в ${pathFull}`);
    } catch (err) {
      throw err;
    }
  });

program.parse();
