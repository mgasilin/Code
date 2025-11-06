import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsEnum, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  Matches,
  IsPhoneNumber 
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ 
    example: '+79160738442', 
    description: 'Номер телефона' 
  })
  @IsString()
  @Matches(/^\+7\d{10}$/, { 
    message: 'Номер телефона должен быть в формате +7XXXXXXXXXX' 
  })
  phone_number: string;

  @ApiProperty({ 
    example: '1234567890', 
    description: 'Пароль' 
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @MaxLength(50, { message: 'Пароль должен быть не более 50 символов' })
  password: string;

  @ApiProperty({ 
    example: 'Максим', 
    description: 'Имя' 
  })
  @IsString()
  @MinLength(2, { message: 'Имя должно быть не менее 2 символов' })
  @MaxLength(100, { message: 'Имя должно быть не более 100 символов' })
  first_name: string;

  @ApiProperty({ 
    example: 'Гасилин', 
    description: 'Фамилия' 
  })
  @IsString()
  @MinLength(2, { message: 'Фамилия должна быть не менее 2 символов' })
  @MaxLength(100, { message: 'Фамилия должна быть не более 100 символов' })
  last_name: string;

  @ApiProperty({ 
    example: 'Дмитриевич', 
    description: 'Отчество',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Отчество должно быть не более 100 символов' })
  patronymic?: string;

  @ApiProperty({ 
    example: 'maksim.gasilin05@gmail.com', 
    description: 'Email',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат email' })
  email?: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.STUDENT, 
    description: 'Роль пользователя' 
  })
  @IsEnum(UserRole, { message: 'Роль должна быть student или teacher' })
  role: UserRole;

  @ApiProperty({ 
    example: '2410', 
    description: 'ID взвода',
    required: false
  })
  @IsOptional()
  @IsString()
  platoon_id?: string;
}