import { ApiProperty } from '@nestjs/swagger';
import { PlatoonResponseDto } from './platoon-response';

export class PlatoonsResponseDto {
  @ApiProperty({ type: [PlatoonResponseDto], description: 'Список взводов' })
  data: PlatoonResponseDto[];

  @ApiProperty({ example: 25, description: 'Общее количество взводов' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество записей на странице' })
  limit: number;
}