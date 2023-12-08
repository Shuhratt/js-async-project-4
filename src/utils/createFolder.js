import logger from './logger.js';
import fs from 'fs';

export default (output) => {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true }); // при recursive=true возращает первый созданный путь к каталогу.
    logger.info(`Создана папка ${output}`);
  }
};
