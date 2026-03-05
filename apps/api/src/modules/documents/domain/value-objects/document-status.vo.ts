import { BadRequestException } from '@nestjs/common';
import { DocumentStatus as RepoDocumentStatus } from '@repo/types';

export class DocumentStatus {
  private constructor(private readonly value: RepoDocumentStatus) {}

  static validate(v: string): DocumentStatus {
    if (!Object.values(RepoDocumentStatus).includes(v as RepoDocumentStatus)) {
      throw new BadRequestException(`Invalid document status: ${v}`);
    }
    return new DocumentStatus(v as RepoDocumentStatus);
  }

  getValue(): RepoDocumentStatus {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
