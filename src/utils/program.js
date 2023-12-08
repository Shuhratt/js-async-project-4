const program = new Command();

import { Command } from 'commander';
import { writeFile } from 'fs/promises';

import formatHtml from './formatHtml.js';
import axiosInstance from './axiosInstance.js';
import formatLink from './formatLink.js';
import createFolder from './createFolder.js';
import logger from './logger.js';

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
    }
  });

export default program;
