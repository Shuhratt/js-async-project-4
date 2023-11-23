import { load } from 'cheerio';
import formatLink from '../utils/formatLink';

const formatHtml = (pageUrl, html) => {
  if (!pageUrl) throw new Error('Не указан url');
  if (!html) throw new Error('Не указан html');

  const { host, pathname } = new URL(pageUrl);
  const nameStart = formatLink(`${host}${pathname}`);
  const nameHost = formatLink(`${host}`);

  const $ = load(html);
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt');
    const [path, ext] = src.split('.');
    const srcFormat = `${nameStart}_files/${nameHost}${formatLink(path)}.${ext}`;
    const img = $(`<img src="${srcFormat}" alt="${alt}"/>`);
    $(el).replaceWith(img);
  });

  return $.html();
};

export default formatHtml;
