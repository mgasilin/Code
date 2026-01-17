import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity('disciplines')
export class Discipline {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор дисциплины' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID курса' })
  @Column({ name: 'cource_id' }) 
  courseId: number;

  @ApiProperty({ example: 'Базы данных', description: 'Название дисциплины' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Изучение основ баз данных', description: 'Описание дисциплины', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 2, description: 'Год обучения (1-3)' })
  @Column({ name: 'year_of_study' })
  yearOfStudy: number;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ type: () => User, description: 'Пользователь, создавший дисциплину', nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Course, course => course.disciplines)
  @JoinColumn({ name: 'cource_id' }) 
  course: Course;

  @OneToMany(() => Lesson, lesson => lesson.discipline)
  lessons: Lesson[];
}