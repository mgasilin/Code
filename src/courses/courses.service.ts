// courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Discipline } from '../entities/discipline.entity';
import { DisciplineCourse } from '../entities/discipline-course.entity';
import { CourseResponseDto } from './dto/course-response';
import { CoursesResponseDto } from './dto/courses-response';
import { CreateCourseDto } from './dto/create-course';
import { UpdateCourseDto } from './dto/update-course';
import { DisciplineResponseDto } from '../disciplines/dto/discipline-response';

interface FindAllOptions {
  page: number;
  limit: number;
  isActive: boolean;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Discipline)
    private disciplinesRepository: Repository<Discipline>,
    @InjectRepository(DisciplineCourse)
    private disciplineCourseRepository: Repository<DisciplineCourse>,
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

    if (existingCourse) {
      throw new BadRequestException('Направление подготовки с таким названием уже существует');
    }

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
      if (updateCourseDto.name !== course.name) {
        const existingCourse = await this.coursesRepository.findOne({
          where: { name: updateCourseDto.name },
        });
        if (existingCourse) {
          throw new BadRequestException('Направление подготовки с таким названием уже существует');
        }
      }
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
      throw new NotFoundException('Направление подготовки не найдено');
    }

    const skip = (page - 1) * limit;

    const [disciplineCourses, total] = await this.disciplineCourseRepository.findAndCount({
      where: { courseId },
      relations: [
        'discipline', 
        'discipline.courseLinks', 
        'discipline.courseLinks.course', 
        'discipline.createdBy'
      ],
      skip,
      take: limit,
    });

    console.log(`Найдено связей для курса ${courseId}:`, disciplineCourses.length);

    let disciplines = disciplineCourses
      .map(dc => dc.discipline)
      .filter(discipline => discipline !== null);

    console.log(`Получено дисциплин:`, disciplines.length);

    const disciplinesDto = disciplines.map(discipline => 
      this.disciplineToResponseDto(discipline)
    );

    return {
      data: disciplinesDto,
      total: disciplines.length,
      page,
      limit,
    };
  }

  async getAllDisciplinesByCourse(courseId: number): Promise<DisciplineResponseDto[]> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    const disciplineCourses = await this.disciplineCourseRepository.find({
      where: { courseId },
      relations: [
        'discipline', 
        'discipline.courseLinks', 
        'discipline.courseLinks.course', 
        'discipline.createdBy'
      ],
    });

    const disciplines = disciplineCourses
      .map(dc => dc.discipline)
      .filter(discipline => discipline !== null);

    return disciplines.map(discipline => this.disciplineToResponseDto(discipline));
  }

  async addDisciplineToCourse(courseId: number, disciplineId: number): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    const discipline = await this.disciplinesRepository.findOne({
      where: { id: disciplineId },
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    // Проверяем, не существует ли уже такая связь
    const existingLink = await this.disciplineCourseRepository.findOne({
      where: { courseId, disciplineId },
    });

    if (existingLink) {
      throw new BadRequestException('Дисциплина уже привязана к этому направлению');
    }

    const disciplineCourse = this.disciplineCourseRepository.create({
      courseId,
      disciplineId,
    });

    await this.disciplineCourseRepository.save(disciplineCourse);
  }

  async removeDisciplineFromCourse(courseId: number, disciplineId: number): Promise<void> {
    // Проверяем, что у дисциплины останется хотя бы один курс после удаления
    const linksCount = await this.disciplineCourseRepository.count({
      where: { disciplineId },
    });

    if (linksCount <= 1) {
      throw new BadRequestException(
        'Нельзя удалить единственную связь дисциплины. Дисциплина должна быть привязана хотя бы к одному направлению подготовки'
      );
    }

    const result = await this.disciplineCourseRepository.delete({
      courseId,
      disciplineId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Связь между направлением и дисциплиной не найдена');
    }
  }

  async getCoursesByDiscipline(disciplineId: number): Promise<CourseResponseDto[]> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id: disciplineId },
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    const disciplineCourses = await this.disciplineCourseRepository.find({
      where: { disciplineId },
      relations: ['course'],
    });

    return disciplineCourses.map(dc => this.toResponseDto(dc.course));
  }

  async getDisciplinesCountByCourse(courseId: number): Promise<number> {
    return this.disciplineCourseRepository.count({
      where: { courseId },
    });
  }

  async getActiveDisciplinesByCourse(courseId: number): Promise<DisciplineResponseDto[]> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    const disciplineCourses = await this.disciplineCourseRepository.find({
      where: { courseId },
      relations: [
        'discipline', 
        'discipline.courseLinks', 
        'discipline.courseLinks.course', 
        'discipline.createdBy'
      ],
    });

    const activeDisciplines = disciplineCourses
      .map(dc => dc.discipline)
      .filter(d => d !== null && d.isActive === true);

    return activeDisciplines.map(discipline => this.disciplineToResponseDto(discipline));
  }

  async getDisciplinesByYearOfStudy(
    courseId: number, 
    yearOfStudy: number
  ): Promise<DisciplineResponseDto[]> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    const disciplineCourses = await this.disciplineCourseRepository.find({
      where: { courseId },
      relations: [
        'discipline', 
        'discipline.courseLinks', 
        'discipline.courseLinks.course', 
        'discipline.createdBy'
      ],
    });

    const filteredDisciplines = disciplineCourses
      .map(dc => dc.discipline)
      .filter(d => d !== null && d.yearOfStudy === yearOfStudy && d.isActive === true);

    return filteredDisciplines.map(discipline => this.disciplineToResponseDto(discipline));
  }

  async checkDisciplineInCourse(courseId: number, disciplineId: number): Promise<boolean> {
    const link = await this.disciplineCourseRepository.findOne({
      where: { courseId, disciplineId },
    });
    return !!link;
  }

  async getCoursesStats(): Promise<any> {
    const courses = await this.coursesRepository.find({
      where: { isActive: true },
    });

    const stats = await Promise.all(
      courses.map(async (course) => {
        const disciplineCourses = await this.disciplineCourseRepository.find({
          where: { courseId: course.id },
          relations: ['discipline'],
        });

        const disciplines = disciplineCourses.map(dc => dc.discipline).filter(d => d !== null);
        
        const totalDisciplines = disciplines.length;
        const activeDisciplines = disciplines.filter(d => d.isActive).length;
        
        const distributionByYear: Record<number, number> = {};
        disciplines.forEach(d => {
          distributionByYear[d.yearOfStudy] = (distributionByYear[d.yearOfStudy] || 0) + 1;
        });

        return {
          courseId: course.id,
          courseName: course.name,
          totalDisciplines,
          activeDisciplines,
          inactiveDisciplines: totalDisciplines - activeDisciplines,
          distributionByYear,
        };
      })
    );

    return stats;
  }

  private disciplineToResponseDto(discipline: Discipline): DisciplineResponseDto {
    const courses = discipline.courseLinks
      ?.map(link => link.course)
      .filter(course => course !== null) || [];

    return {
      id: discipline.id,
      name: discipline.name,
      description: discipline.description,
      year_of_study: discipline.yearOfStudy,
      is_active: discipline.isActive,
      created_by: discipline.createdBy?.id || null,
      courses: courses.map(course => this.courseToResponseDto(course)),
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