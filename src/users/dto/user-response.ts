import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';
import { PlatoonResponseDto } from '../../platoons/dto/platoon-response';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
  id: number;

  @ApiProperty({ example: 'ivanov_ii', description: 'LDAP идентификатор', nullable: true })
  ldap_uid: string;

  @ApiProperty({ example: '+79001234567', description: 'Номер телефона' })
  phone_number: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({ example: 'Иванович', description: 'Отчество', nullable: true })
  patronymic: string;

  @ApiProperty({ example: 'ivanov@vuc.local', description: 'Email адрес' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT, description: 'Роль пользователя' })
  role: UserRole;

  @ApiProperty({ type: () => PlatoonResponseDto, description: 'Взвод', nullable: true })
  platoon?: PlatoonResponseDto;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата последнего входа' })
  last_login_at: Date;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  is_active: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  updated_at: Date;
}