import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('files/:filePath')
  showImage(@Param('filePath') file, @Res() res: Response) {
    return res.sendFile(file, { root: './files' });
  }
}
