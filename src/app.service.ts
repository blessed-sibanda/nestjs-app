import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async deleteFile(filename?: string | undefined) {
    if (filename) {
      let path = join(__dirname, '../', 'files', filename);
      try {
        await unlink(path);
      } catch (err) {}
    }
  }
}
