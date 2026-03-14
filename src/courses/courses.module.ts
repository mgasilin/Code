import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { DisciplineCourse } from '../entities/discipline-course.entity';
import { Course } from '../entities/course.entity';
import { Discipline } from '../entities/discipline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Discipline, DisciplineCourse]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}