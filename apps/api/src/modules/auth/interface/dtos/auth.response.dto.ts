import { ApiProperty } from '@nestjs/swagger';

class SessionUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true })
  email!: string | null;

  @ApiProperty({ nullable: true })
  name!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ nullable: true, example: 'dev' })
  provider!: string | null;
}

class SessionDto {
  @ApiProperty({ nullable: true })
  id!: string | null;
}

export class AuthSessionResponseDto {
  @ApiProperty({ example: true })
  authenticated!: true;

  @ApiProperty({ type: SessionUserDto })
  user!: SessionUserDto;

  @ApiProperty({ type: SessionDto })
  session!: SessionDto;
}
