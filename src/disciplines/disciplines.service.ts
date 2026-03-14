// disciplines/disciplines.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Discipline } from '../entities/discipline.entity';
import { Course } from '../entities/course.entity';
import { DisciplineCourse } from '../entities/discipline-course.entity';
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
    @InjectRepository(DisciplineCourse)
    private disciplineCourseRepository: Repository<DisciplineCourse>,
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
      relations: ['discipline', 'discipline.courseLinks', 'discipline.courseLinks.course', 'createdBy'],
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

      links: lesson.links?.map(link => ({
        id: link.id,
        lesson_id: link.lessonId,   
        link_type: link.linkType,
        url: link.url,
        title: link.title,
        description: link.description,
        created_at: link.createdAt,
      })).sort((a, b) => b.created_at.getTime() - a.created_at.getTime()) || [],
      
      texts: lesson.texts?.map(text => ({
        id: text.id,
        lesson_id: text.lessonId,   
        title: text.title,
        content: text.materialText,
        order_number: text.orderNumber,
        created_at: text.createdAt,
      })).sort((a, b) => a.order_number - b.order_number) || [],
      
      attachments: lesson.attachments?.map(att => ({
        id: att.id,
        lesson_id: att.lessonId,   
        file_name: att.fileName,
        file_type: att.fileType,
        file_size: att.fileSize,
        file_url: `/api/attachments/${att.id}/download`,
        uploaded_by: att.uploadedBy,   
        uploaded_at: att.uploadedAt,
      })).sort((a, b) => b.uploaded_at.getTime() - a.uploaded_at.getTime()) || [],

      created_at: lesson.createdAt,
      updated_at: lesson.updatedAt,
    };
  }
  
  async findAll(options: FindAllOptions): Promise<DisciplinesResponseDto> {
    const { page, limit, courseId, yearOfStudy, isActive } = options;
    const skip = (page - 1) * limit;

    let disciplineIds: number[] | undefined;
    
    // Если указан courseId, сначала получаем ID дисциплин, привязанных к этому курсу
    if (courseId) {
      const disciplineCourses = await this.disciplineCourseRepository.find({
        where: { courseId },
        select: ['disciplineId'],
      });
      disciplineIds = disciplineCourses.map(dc => dc.disciplineId);
      
      if (disciplineIds.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          limit,
        };
      }
    }

    const where: any = {};
    
    if (disciplineIds) {
      where.id = In(disciplineIds);
    }
    
    if (yearOfStudy !== undefined) {
      where.yearOfStudy = yearOfStudy;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [disciplines, total] = await this.disciplinesRepository.findAndCount({
      where,
      relations: ['courseLinks', 'courseLinks.course', 'createdBy'],
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
    // Проверяем существование всех курсов
    const courses = await this.coursesRepository.find({
      where: { id: In(createDisciplineDto.course_ids) },
    });

    if (courses.length !== createDisciplineDto.course_ids.length) {
      const foundIds = courses.map(c => c.id);
      const missingIds = createDisciplineDto.course_ids.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Направления подготовки с ID ${missingIds.join(', ')} не найдены`);
    }

    // Проверяем уникальность названия дисциплины
    const existingDiscipline = await this.disciplinesRepository.findOne({
      where: { name: createDisciplineDto.name },
    });

    if (existingDiscipline) {
      throw new BadRequestException('Дисциплина с таким названием уже существует');
    }

    // Создаем дисциплину
    const discipline = this.disciplinesRepository.create({
      name: createDisciplineDto.name,
      description: createDisciplineDto.description,
      yearOfStudy: createDisciplineDto.year_of_study || 1,
      isActive: true,
      createdBy: { id: createdByUserId } as any,
    });

    const savedDiscipline = await this.disciplinesRepository.save(discipline);

    // Создаем связи со всеми курсами
    const disciplineCourses = createDisciplineDto.course_ids.map(courseId => 
      this.disciplineCourseRepository.create({
        courseId,
        disciplineId: savedDiscipline.id,
      })
    );

    await this.disciplineCourseRepository.save(disciplineCourses);
    
    const disciplineWithRelations = await this.disciplinesRepository.findOne({
      where: { id: savedDiscipline.id },
      relations: ['courseLinks', 'courseLinks.course', 'createdBy'],
    });

    return this.toResponseDto(disciplineWithRelations);
  }

  async findOne(id: number): Promise<DisciplineResponseDto> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id },
      relations: ['courseLinks', 'courseLinks.course', 'createdBy'],
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    return this.toResponseDto(discipline);
  }

  async update(id: number, updateDisciplineDto: UpdateDisciplineDto): Promise<DisciplineResponseDto> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id },
      relations: ['courseLinks', 'courseLinks.course', 'createdBy'],
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    // Обновляем поля
    if (updateDisciplineDto.name !== undefined) {
      if (updateDisciplineDto.name !== discipline.name) {
        const existingDiscipline = await this.disciplinesRepository.findOne({
          where: { name: updateDisciplineDto.name },
        });
        if (existingDiscipline) {
          throw new BadRequestException('Дисциплина с таким названием уже существует');
        }
      }
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

    // Если передан массив course_ids, обновляем связи
    if (updateDisciplineDto.course_ids) {
      const courses = await this.coursesRepository.find({
        where: { id: In(updateDisciplineDto.course_ids) },
      });

      if (courses.length !== updateDisciplineDto.course_ids.length) {
        const foundIds = courses.map(c => c.id);
        const missingIds = updateDisciplineDto.course_ids.filter(id => !foundIds.includes(id));
        throw new NotFoundException(`Направления подготовки с ID ${missingIds.join(', ')} не найдены`);
      }

      await this.disciplineCourseRepository.delete({ disciplineId: id });

      const newDisciplineCourses = updateDisciplineDto.course_ids.map(courseId => 
        this.disciplineCourseRepository.create({
          courseId,
          disciplineId: id,
        })
      );

      await this.disciplineCourseRepository.save(newDisciplineCourses);
    }

    const updatedDiscipline = await this.disciplinesRepository.save(discipline);
    
    const disciplineWithRelations = await this.disciplinesRepository.findOne({
      where: { id: updatedDiscipline.id },
      relations: ['courseLinks', 'courseLinks.course', 'createdBy'],
    });

    return this.toResponseDto(disciplineWithRelations);
  }

  async addCourseToDiscipline(disciplineId: number, courseId: number): Promise<void> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id: disciplineId },
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Направление подготовки не найдено');
    }

    const existingLink = await this.disciplineCourseRepository.findOne({
      where: { disciplineId, courseId },
    });

    if (existingLink) {
      throw new BadRequestException('Дисциплина уже привязана к этому направлению');
    }

    const disciplineCourse = this.disciplineCourseRepository.create({
      disciplineId,
      courseId,
    });

    await this.disciplineCourseRepository.save(disciplineCourse);
  }

  async removeCourseFromDiscipline(disciplineId: number, courseId: number): Promise<void> {
    const linksCount = await this.disciplineCourseRepository.count({
      where: { disciplineId },
    });

    if (linksCount <= 1) {
      throw new BadRequestException('Дисциплина должна быть привязана хотя бы к одному направлению подготовки');
    }

    const result = await this.disciplineCourseRepository.delete({
      disciplineId,
      courseId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Связь между дисциплиной и направлением не найдена');
    }
  }

  private toResponseDto(discipline: Discipline): DisciplineResponseDto {
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
}