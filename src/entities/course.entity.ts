import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Discipline } from './discipline.entity';
import { Platoon } from './platoon.entity';
import { User } from './user.entity';

@Entity('cources')  
export class Course {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор курса' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Программная инженерия', description: 'Название курса' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Подготовка программистов', description: 'Описание курса', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ type: () => User, description: 'Пользователь, создавший курс', nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Discipline, discipline => discipline.course)
  disciplines: Discipline[];

  @OneToMany(() => Platoon, platoon => platoon.course)
  platoons: Platoon[];
}