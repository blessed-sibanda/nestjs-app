import { Test, TestingModule } from '@nestjs/testing';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteFile', () => {
    it('should delete file if file exists', async () => {
      const name = 'my-file.txt';
      const filepath = join(__dirname, '../files', name);
      await writeFile(filepath, 'some text', 'utf-8');
      expect(existsSync(filepath)).toBeTruthy();
      await service.deleteFile(name);
      expect(existsSync(filepath)).toBeFalsy();
    });
  });
});
