import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from '../entities/discipline.entity';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discipline, Course, Lesson]),
  ],
  controllers: [DisciplinesController],
  providers: [DisciplinesService],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}