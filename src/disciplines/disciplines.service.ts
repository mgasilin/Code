import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discipline } from '../entities/discipline.entity';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity'; 
import { DisciplineResponseDto } from './dto/discipline-response';
import { DisciplinesResponseDto } from './dto/disciplines-response';
import { CreateDisciplineDto } from './dto/create-discipline';
import { UpdateDisciplineDto } from './dto/update-discipline';
import { CourseResponseDto } from '../courses/dto/course-response';
import { LessonResponseDto } from '../lessons/dto/lesson-response';

interface FindAllOptions {
  page: number;
  limit: number;
  courseId?: number;
  yearOfStudy?: number;
  isActive?: boolean;
}

@Injectable()
export class DisciplinesService {
  constructor(
    @InjectRepository(Discipline)
    private disciplinesRepository: Repository<Discipline>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>
  ) {}

  
  async getLessonsByDiscipline(
    disciplineId: number, 
    page: number = 1, 
    limit: number = 20, 
    lessonType?: string,
    isActive: boolean = true
  ): Promise<{ data: LessonResponseDto[]; total: number; page: number; limit: number }> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id: disciplineId },
      relations: ['course'],
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    const skip = (page - 1) * limit;
    const where: any = {
      disciplineId: disciplineId
    };
    
    if (lessonType !== undefined) {
      where.lessonType = lessonType;
    }

    const [lessons, total] = await this.lessonsRepository.findAndCount({
      where,
      relations: ['discipline', 'discipline.course', 'createdBy'],
      skip,
      take: limit,
      order: { orderNumber: 'ASC' },
    });

    const lessonsDto = lessons.map(lesson => this.lessonToResponseDto(lesson));

    return {
      data: lessonsDto,
      total,
      page,
      limit,
    };
  }

  private lessonToResponseDto(lesson: Lesson): LessonResponseDto {
    return {
      id: lesson.id,
      name: lesson.name,
      order_number: lesson.orderNumber,
      description: lesson.description,
      lesson_type: lesson.lessonType,
      is_active: lesson.isActive,
      created_by: lesson.createdBy?.id || null,
      discipline: this.toResponseDto(lesson.discipline),
      created_at: lesson.createdAt,
      updated_at: lesson.updatedAt,
    };
  }
  
  async findAll(options: FindAllOptions): Promise<DisciplinesResponseDto> {
    const { page, limit, courseId, yearOfStudy, isActive } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (courseId !== undefined) {
      where.courseId = courseId;
    }
    
    if (yearOfStudy !== undefined) {
      where.yearOfStudy = yearOfStudy;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [disciplines, total] = await this.disciplinesRepository.findAndCount({
      where,
      relations: ['course', 'createdBy'],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    const disciplinesDto = disciplines.map(discipline => this.toResponseDto(discipline));

    return {
      data: disciplinesDto,
      total,
      page,
      limit,
    };
  }

  async create(createDisciplineDto: CreateDisciplineDto, createdByUserId: number): Promise<DisciplineResponseDto> {
    const course = await this.coursesRepository.findOne({
      where: { id: createDisciplineDto.course_id },
    });

    if (!course) {
      throw new NotFoundException('Курс не найден');
    }

    const discipline = this.disciplinesRepository.create({
      courseId: createDisciplineDto.course_id,
      name: createDisciplineDto.name,
      description: createDisciplineDto.description,
      yearOfStudy: createDisciplineDto.year_of_study || 1,
      isActive: true,
      createdBy: { id: createdByUserId } as any,
      course: course,
    });

    const savedDiscipline = await this.disciplinesRepository.save(discipline);
    
    const disciplineWithRelations = await this.disciplinesRepository.findOne({
      where: { id: savedDiscipline.id },
      relations: ['course', 'createdBy'],
    });

    return this.toResponseDto(disciplineWithRelations);
  }

  async findOne(id: number): Promise<DisciplineResponseDto> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id },
      relations: ['course', 'createdBy'],
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    return this.toResponseDto(discipline);
  }

  async update(id: number, updateDisciplineDto: UpdateDisciplineDto): Promise<DisciplineResponseDto> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id },
      relations: ['course', 'createdBy'],
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    if (updateDisciplineDto.name !== undefined) {
      discipline.name = updateDisciplineDto.name;
    }

    if (updateDisciplineDto.description !== undefined) {
      discipline.description = updateDisciplineDto.description;
    }

    if (updateDisciplineDto.year_of_study !== undefined) {
      discipline.yearOfStudy = updateDisciplineDto.year_of_study;
    }

    if (updateDisciplineDto.is_active !== undefined) {
      discipline.isActive = updateDisciplineDto.is_active;
    }

    const updatedDiscipline = await this.disciplinesRepository.save(discipline);
    return this.toResponseDto(updatedDiscipline);
  }

  private toResponseDto(discipline: Discipline): DisciplineResponseDto {
    return {
      id: discipline.id,
      name: discipline.name,
      description: discipline.description,
      year_of_study: discipline.yearOfStudy,
      is_active: discipline.isActive,
      created_by: discipline.createdBy?.id || null,
      course: this.courseToResponseDto(discipline.course),
      created_at: discipline.createdAt,
      updated_at: discipline.updatedAt,
    };
  }

  private courseToResponseDto(course: Course): CourseResponseDto {
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      is_active: course.isActive,
      created_at: course.createdAt,
      updated_at: course.updatedAt,
    };
  }
}