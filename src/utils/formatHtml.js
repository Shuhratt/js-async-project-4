import { load } from 'cheerio';
import { writeFile } from 'fs/promises';
import formatLink from './formatLink.js';
import createFolder from './createFolder.js';
import axiosInstance from './axiosInstance.js';
import logger from './logger.js';

const nodes = ['img', 'script', 'link'];
const typesAttrByNode = new Map([
  [['img', 'script'], 'src'],
  [['link'], 'href'],
]);

const formatHtml = (pageUrl, html) => {
  if (!pageUrl) throw new Error('Не указан url');
  if (!html) throw new Error('Не указан html');

  const base = new URL('/', pageUrl).origin;
  const { host, pathname } = new URL(pageUrl, base);

  const nameStartDirectory = formatLink(`${host}${pathname}`);
  const nameStartFile = formatLink(`${host}`);

  createFolder(`${nameStartDirectory}_files`);

  const $ = load(html);
  nodes.forEach((node) => {
    $(node).each(async (_, el) => {
      try {
        let attrUrl;
        typesAttrByNode.forEach((val, keys) => {
          if (keys.includes(node)) {
            attrUrl = val;
            return;
          }
        });
        const src = $(el).attr(attrUrl);
        const [path, ext] = src.split('.');
        const isRelativeLink = new URL(src, base).origin === base;

        if (isRelativeLink) {
          const nameFile = `${nameStartFile}${formatLink(path)}`;
          const directoryName = `${nameStartDirectory}_files`;
          const nameDirectory = `${directoryName}/${nameFile}`;

          const fullNameDirectory = `${nameDirectory}.${ext ?? 'html'}`;

          $(el).attr(attrUrl, (_, src) => src.replace(src, fullNameDirectory));

          const url = new URL(src, base).toString();
          logger.info(`Запуск скачивания файла ${src}`);
          const { data } = await axiosInstance.get(url);
          logger.info(`Файл ${src} скачан`);
          logger.info(`Запуск сохранения ${src} в ${directoryName}`);
          await writeFile(fullNameDirectory, data);
          logger.info(`Файл ${src} сохранён в ${directoryName}`);
        }
      } catch (error) {
        if (error.response) {
          const { status, statusText } = error.response;
          logger.error(`Error: ${status} ${statusText} ${error.config.url}`);
        } else {
          logger.error(`Error ${error.message}`);
        }
      }
    });
  });

  return $.html();
};

export default formatHtml;
