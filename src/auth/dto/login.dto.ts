import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsOptional, ValidateIf } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '+79001234567', required: false })
  @ValidateIf(o => !o.ldap_username)
  @IsString()
  @Matches(/^\+7\d{10}$/, { message: 'Phone number must match format +7XXXXXXXXXX' })
  phone_number?: string;

  @ApiProperty({ example: 'password123', required: false })
  @ValidateIf(o => o.phone_number)
  @IsString()
  password?: string;

  @ApiProperty({ example: 'ivanov_ii', required: false })
  @ValidateIf(o => !o.phone_number)
  @IsString()
  ldap_username?: string;

  @ApiProperty({ example: 'ldapPassword', required: false })
  @ValidateIf(o => o.ldap_username)
  @IsString()
  ldap_password?: string;
}