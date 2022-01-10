import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { imageUploadMulterOptions } from 'src/shared/file-upload.utils';

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
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
