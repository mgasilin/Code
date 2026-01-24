import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response';

export class UsersResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'Список пользователей' })
  data: UserResponseDto[];

  @ApiProperty({ example: 100, description: 'Общее количество пользователей' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество записей на странице' })
  limit: number;

  @ApiProperty({ example: 5, description: 'Общее количество страниц' })
  total_pages: number;
}