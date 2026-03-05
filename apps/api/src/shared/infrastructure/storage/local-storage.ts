import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../utils/env';

@Injectable()
export class LocalStorage {
  private readonly baseDir: string;

  constructor() {
    this.baseDir = path.resolve(env.FILE_UPLOAD_DIR);
  }

  public async saveFile(
    buffer: Buffer,
    originalName: string,
    userId: string,
  ): Promise<string> {
    const userDir = path.join(this.baseDir, userId);
    await fs.mkdir(userDir, { recursive: true });

    const fileName = `${Date.now()}-${originalName}`;
    const filePath = path.join(userDir, fileName);

    await fs.writeFile(filePath, buffer);

    return path.relative(this.baseDir, filePath);
  }

  public async getFile(relativeFilePath: string): Promise<Buffer> {
    const filePath = path.join(this.baseDir, relativeFilePath);
    return fs.readFile(filePath);
  }

  public async deleteFile(relativeFilePath: string): Promise<void> {
    const filePath = path.join(this.baseDir, relativeFilePath);
    await fs.unlink(filePath);
  }
}
