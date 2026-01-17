import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from '../entities/course.entity';
import { Discipline } from '../entities/discipline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Discipline]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}