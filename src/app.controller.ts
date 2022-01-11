import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('files/:filePath')
  showImage(@Param('filePath') file, @Res() res: Response) {
    return res.sendFile(file, { root: './files' });
  }
}
