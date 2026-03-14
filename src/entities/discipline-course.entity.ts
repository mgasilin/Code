import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from './course.entity';
import { Discipline } from './discipline.entity';

@Entity('discipline_cources')
export class DisciplineCourse {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор связи' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID направления подготовки' })
  @Column({ name: 'cource_id' })
  courseId: number;

  @ApiProperty({ example: 1, description: 'ID дисциплины' })
  @Column({ name: 'discipline_id' })
  disciplineId: number;

  @ManyToOne(() => Course, course => course.disciplineCourses)
  @JoinColumn({ name: 'cource_id' })
  course: Course;

  @ManyToOne(() => Discipline, discipline => discipline.courseLinks)
  @JoinColumn({ name: 'discipline_id' })
  discipline: Discipline;
}