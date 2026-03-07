import { ApiProperty } from '@nestjs/swagger';

export class UserSessionViewDto {
  @ApiProperty()
  sessionId!: string;

  @ApiProperty({ nullable: true })
  userAgent!: string | null;

  @ApiProperty({ nullable: true })
  ipAddress!: string | null;

  @ApiProperty()
  expiresAt!: string;

  @ApiProperty()
  current!: boolean;
}
