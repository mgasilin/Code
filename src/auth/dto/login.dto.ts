import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, ValidateIf, IsNotEmpty } from 'class-validator';

export enum AuthType {
  ADMIN = 'admin',
  STUDENT = 'student'
}

export class LoginDto {
  @ApiProperty({ 
    enum: AuthType, 
    example: AuthType.STUDENT, 
    description: 'Тип авторизации' 
  })
  @IsEnum(AuthType, { message: 'Тип авторизации должен быть admin или student' })
  auth_type: AuthType;

  @ApiProperty({ 
    example: 'Иванов', 
    description: 'Фамилия пользователя' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Фамилия обязательна' })
  last_name: string;

  @ApiProperty({ 
    example: 'АБ', 
    description: 'Инициалы (только для student)',
    required: false
  })
  @ValidateIf(o => o.auth_type === AuthType.STUDENT)
  @IsString()
  @IsNotEmpty({ message: 'Инициалы обязательны для типа student' })
  initials?: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Пароль' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}