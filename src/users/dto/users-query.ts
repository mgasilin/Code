import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../entities/user.entity';

export class UsersQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Номер страницы', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Количество записей на странице', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: UserRole, description: 'Фильтр по роли' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: '101A', description: 'Фильтр по ID взвода' })
  @IsOptional()
  @IsString()
  platoon_id?: string;

  @ApiPropertyOptional({ example: true, description: 'Фильтр по активности' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;
}