import { load } from 'cheerio';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import formatLink from './formatLink.js';
import axiosInstance from './axiosInstance.js';

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

  if (!fs.existsSync(`${nameStartDirectory}_files`)) {
    // Cоздаём папку
    fs.mkdirSync(`${nameStartDirectory}_files`, { recursive: true });
  }

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
          const nameDirectory = `${nameStartDirectory}_files/${nameStartFile}${formatLink(path)}`;
          const fullNameDirectory = `${nameDirectory}.${ext ?? 'html'}`;

          $(el).attr(attrUrl, (_, src) => src.replace(src, fullNameDirectory));

          const url = new URL(src, base).toString();
          const { data } = await axiosInstance.get(url); //скачивание
          await writeFile(fullNameDirectory, data); // загрузка
        }
      } catch (error) {
        throw error;
      }
    });
  });

  return $.html();
};

export default formatHtml;
