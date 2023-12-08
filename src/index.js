#!/usr/bin/env node

import { Command } from 'commander';
import { writeFile } from 'fs/promises';

import formatHtml from './utils/formatHtml.js';
import axiosInstance from './utils/axiosInstance.js';
import formatLink from './utils/formatLink.js';
import createFolder from './utils/createFolder.js';
import logger from './utils/logger.js';

const program = new Command();

program
  .name('page-loader')
  .version('1.0.0')
  .argument('<url>')
  .option('-o, --output <dir>', 'output dir', process.cwd())
  .action(async (url, { output }) => {
    const { host, pathname } = new URL(url);
    const linkOutput = `${host}${pathname}`;
    const nameFileFormat = formatLink(linkOutput);
    const isDefaultPath = output === process.cwd();
    const pathFull = `${!isDefaultPath ? `${output}` : process.cwd()}`;
    const formatFullName = `${pathFull}/${nameFileFormat}.html`;

    try {
      logger.info(`Запуск загрузки страницы ${url}`);
      const { data } = await axiosInstance.get(url);
      logger.info(`Загрузка страницы ${url} завершена`);
      createFolder(output);
      const html = formatHtml(url, data);
      await writeFile(formatFullName, html);
      logger.info(`Создан файл ${nameFileFormat}.html в ${pathFull} `);
    } catch (error) {
      if (error.response) {
        const { status, statusText } = error.response;
        logger.error(`Error response: ${status} ${statusText}`);
      } else {
        logger.error(`Error ${error.message}`);
      }
      throw error;
    }
  });

program.parse();

export { program };
