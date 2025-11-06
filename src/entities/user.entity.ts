import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Platoon } from './platoon.entity';
import { RefreshToken } from './refresh-token.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher'
}

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'ivanov_ii', description: 'LDAP идентификатор', nullable: true })
  @Column({ name: 'ldap_uid', unique: true, nullable: true })
  ldapUid: string;

  @ApiProperty({ example: '+79001234567', description: 'Номер телефона' })
  @Column({ name: 'phone_number', unique: true, nullable: true })
  phoneNumber: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({ example: 'Иванович', description: 'Отчество', nullable: true })
  @Column({ nullable: true })
  patronymic: string;

  @ApiProperty({ example: 'ivanov@vuc.local', description: 'Email адрес' })
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT, description: 'Роль пользователя' })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: '101A', description: 'ID взвода', nullable: true })
  @ManyToOne(() => Platoon, { nullable: true })
  @JoinColumn({ name: 'platoon_id' })
  platoon: Platoon;

  @Column({ name: 'platoon_id', nullable: true })
  platoonId: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата последнего входа' })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];
}