import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

const imageFileFilter = (req, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

const editFileName = (req, file: Express.Multer.File, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(5)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString())
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageUploadMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: './files',
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
};
