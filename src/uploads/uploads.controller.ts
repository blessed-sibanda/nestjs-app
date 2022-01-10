import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadMulterOptions } from 'src/uploads/uploads.utils';

@Controller('uploads')
export class UploadsController {
  @Post('image')
  @UseInterceptors(FileInterceptor('image', imageUploadMulterOptions))
  uploadImage(@UploadedFile() file?: Express.Multer.File) {
    const response = {
      originalName: file?.originalname,
      filename: file?.filename,
    };
    return response;
  }

  @Get('image/:imagePath')
  showImage(@Param('imagePath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }
}
