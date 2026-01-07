import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platoon } from '../entities/platoon.entity';
import { Course } from '../entities/course.entity'; 
import { PlatoonResponseDto } from './dto/platoon-response';
import { PlatoonsResponseDto } from './dto/platoons-response';
import { CreatePlatoonDto } from './dto/create-platoon';
import { UpdatePlatoonDto } from './dto/update-platoon';
import { CourseResponseDto } from '../courses/dto/course-response';

interface FindAllOptions {
  page: number;
  limit: number;
  yearOfStudy?: number;
  isActive?: boolean;
  courseId?: number; // НОВОЕ: фильтр по курсу
}

@Injectable()
export class PlatoonsService {
  constructor(
    @InjectRepository(Platoon)
    private platoonsRepository: Repository<Platoon>,
    @InjectRepository(Course) // НОВОЕ: добавляем репозиторий Course
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(options: FindAllOptions): Promise<PlatoonsResponseDto> {
    const { page, limit, yearOfStudy, isActive, courseId } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (yearOfStudy !== undefined) {
      where.yearOfStudy = yearOfStudy;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // НОВОЕ: фильтр по курсу
    if (courseId !== undefined) {
      where.courseId = courseId;
    }

    const [platoons, total] = await this.platoonsRepository.findAndCount({
      where,
      relations: ['course'], // НОВОЕ: загружаем курс
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    const platoonsDto = platoons.map(platoon => this.toResponseDto(platoon));

    return {
      data: platoonsDto,
      total,
      page,
      limit,
    };
  }

  async create(createPlatoonDto: CreatePlatoonDto): Promise<PlatoonResponseDto> {
    // Проверяем, существует ли уже взвод с таким ID
    const existingPlatoon = await this.platoonsRepository.findOne({
      where: { id: createPlatoonDto.id },
    });

    if (existingPlatoon) {
      throw new ConflictException('Взвод с таким ID уже существует');
    }

    // НОВОЕ: Проверяем существование курса, если указан
    let course: Course | undefined;
    if (createPlatoonDto.course_id) {
      course = await this.coursesRepository.findOne({
        where: { id: createPlatoonDto.course_id },
      });

      if (!course) {
        throw new NotFoundException('Направление подготовки не найдено');
      }
    }

    // Создаем новый взвод
    const platoon = this.platoonsRepository.create({
      id: createPlatoonDto.id,
      yearOfStudy: createPlatoonDto.year_of_study,
      description: createPlatoonDto.description,
      courseId: createPlatoonDto.course_id,
      isActive: true,
    });

    const savedPlatoon = await this.platoonsRepository.save(platoon);
    
    // Загружаем с relations для возврата
    const platoonWithCourse = await this.platoonsRepository.findOne({
      where: { id: savedPlatoon.id },
      relations: ['course'],
    });

    return this.toResponseDto(platoonWithCourse);
  }

  async update(id: string, updatePlatoonDto: UpdatePlatoonDto): Promise<PlatoonResponseDto> {
    // Находим взвод
    const platoon = await this.platoonsRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!platoon) {
      throw new NotFoundException('Взвод не найден');
    }

    // НОВОЕ: Проверяем существование курса, если указан
    if (updatePlatoonDto.course_id !== undefined) {
      if (updatePlatoonDto.course_id === null) {
        platoon.courseId = null;
        platoon.course = null;
      } else {
        const course = await this.coursesRepository.findOne({
          where: { id: updatePlatoonDto.course_id },
        });

        if (!course) {
          throw new NotFoundException('Направление подготовки не найдено');
        }
        
        platoon.courseId = updatePlatoonDto.course_id;
        platoon.course = course;
      }
    }

    // Обновляем остальные поля
    if (updatePlatoonDto.year_of_study !== undefined) {
      platoon.yearOfStudy = updatePlatoonDto.year_of_study;
    }

    if (updatePlatoonDto.description !== undefined) {
      platoon.description = updatePlatoonDto.description;
    }

    if (updatePlatoonDto.is_active !== undefined) {
      platoon.isActive = updatePlatoonDto.is_active;
    }

    const updatedPlatoon = await this.platoonsRepository.save(platoon);
    return this.toResponseDto(updatedPlatoon);
  }

  async findOne(id: string): Promise<Platoon | null> {
    return this.platoonsRepository.findOne({
      where: { id },
      relations: ['course'], // НОВОЕ: загружаем курс
    });
  }

  private toResponseDto(platoon: Platoon): PlatoonResponseDto {
    return {
      id: platoon.id,
      year_of_study: platoon.yearOfStudy,
      description: platoon.description,
      is_active: platoon.isActive,
      created_at: platoon.createdAt,
      course: platoon.course ? this.courseToResponseDto(platoon.course) : undefined,
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