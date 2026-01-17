import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Discipline } from '../entities/discipline.entity';
import { CourseResponseDto } from './dto/course-response';
import { CoursesResponseDto } from './dto/courses-response';
import { CreateCourseDto } from './dto/create-course';
import { UpdateCourseDto } from './dto/update-course';
import { DisciplineResponseDto } from '../disciplines/dto/discipline-response';


interface FindAllOptions {
  page: number;
  limit: number;
  isActive?: boolean;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Discipline)
    private disciplinesRepository: Repository<Discipline>,
  ) {}


  async findAll(options: FindAllOptions): Promise<CoursesResponseDto> {
    const { page, limit, isActive } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [courses, total] = await this.coursesRepository.findAndCount({
      where,
      relations: ['createdBy'], 
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    const coursesDto = courses.map(course => this.toResponseDto(course));

    return {
      data: coursesDto,
      total,
      page,
      limit,
    };
  }

  async create(createCourseDto: CreateCourseDto, createdByUserId: number): Promise<CourseResponseDto> {
    const existingCourse = await this.coursesRepository.findOne({
      where: { name: createCourseDto.name },
    });

    const course = this.coursesRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      isActive: true,
      createdBy: { id: createdByUserId } as any, 
    });

    const savedCourse = await this.coursesRepository.save(course);
    
    const courseWithRelations = await this.coursesRepository.findOne({
      where: { id: savedCourse.id },
      relations: ['createdBy'],
    });

    return this.toResponseDto(courseWithRelations);
  }

  async findOne(id: number): Promise<CourseResponseDto> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    return this.toResponseDto(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<CourseResponseDto> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    if (updateCourseDto.name !== undefined) {
      course.name = updateCourseDto.name;
    }

    if (updateCourseDto.description !== undefined) {
      course.description = updateCourseDto.description;
    }

    if (updateCourseDto.is_active !== undefined) {
      course.isActive = updateCourseDto.is_active;
    }

    const updatedCourse = await this.coursesRepository.save(course);
    return this.toResponseDto(updatedCourse);
  }

  async getDisciplinesByCourse(
    courseId: number, 
    page: number = 1, 
    limit: number = 20, 
    isActive: boolean = true
  ): Promise<{ data: DisciplineResponseDto[]; total: number; page: number; limit: number }> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Курс не найден');
    }

    const skip = (page - 1) * limit;
    const where: any = {
      courseId: courseId
    };

    const [disciplines, total] = await this.disciplinesRepository.findAndCount({
      where,
      relations: ['course'],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    console.log(disciplines, courseId, where)

    const disciplinesDto = disciplines.map(discipline => this.disciplineToResponseDto(discipline));

    return {
      data: disciplinesDto,
      total,
      page,
      limit,
    };
  }

  private disciplineToResponseDto(discipline: Discipline): DisciplineResponseDto {
    return {
      id: discipline.id,
      name: discipline.name,
      description: discipline.description,
      year_of_study: discipline.yearOfStudy,
      is_active: discipline.isActive,
      created_by: discipline.createdBy?.id || null,
      course: {
        id: discipline.course.id,
        name: discipline.course.name,
        description: discipline.course.description,
        is_active: discipline.course.isActive,
        created_at: discipline.course.createdAt,
        updated_at: discipline.course.updatedAt,
      },
      created_at: discipline.createdAt,
      updated_at: discipline.updatedAt,
    };
  }

  private toResponseDto(course: Course): CourseResponseDto {
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