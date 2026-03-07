import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ description: 'Current status of the API', example: 'ok' })
  status!: string;

  @ApiProperty({
    description: 'Current ISO 8601 timestamp',
    example: '2026-03-06T12:00:00.000Z',
  })
  timestamp!: string;
}
