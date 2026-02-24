import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson, LessonType } from '../entities/lesson.entity';
import { Discipline } from '../entities/discipline.entity';
import { LessonResponseDto } from './dto/lesson-response';
import { LessonsResponseDto } from './dto/lessons-response';
import { CreateLessonDto } from './dto/create-lesson';
import { UpdateLessonDto } from './dto/update-lesson';
import { DisciplineResponseDto } from '../disciplines/dto/discipline-response';

interface FindAllOptions {
  page: number;
  limit: number;
  disciplineId?: number;
  lessonType?: LessonType;
  isActive?: boolean;
}

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Discipline)
    private disciplinesRepository: Repository<Discipline>,
  ) {}

  async findAll(options: FindAllOptions): Promise<LessonsResponseDto> {
    const { page, limit, disciplineId, lessonType, isActive } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (disciplineId !== undefined) {
      where.disciplineId = disciplineId;
    }
    
    if (lessonType !== undefined) {
      where.lessonType = lessonType;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [lessons, total] = await this.lessonsRepository.findAndCount({
      where,
      relations: ['discipline', 'discipline.course', 'createdBy', 'links', 'texts', 'attachments'],
      skip,
      take: limit,
      order: { orderNumber: 'ASC' },
    });

    const lessonsDto = lessons.map(lesson => this.toResponseDto(lesson));

    return {
      data: lessonsDto,
      total,
      page,
      limit,
    };
  }

  async create(createLessonDto: CreateLessonDto, createdByUserId: number): Promise<LessonResponseDto> {
    const discipline = await this.disciplinesRepository.findOne({
      where: { id: createLessonDto.discipline_id },
      relations: ['course'],
    });

    if (!discipline) {
      throw new NotFoundException('Дисциплина не найдена');
    }

    const existingLesson = await this.lessonsRepository.findOne({
      where: {
        disciplineId: createLessonDto.discipline_id,
        orderNumber: createLessonDto.order_number,
      },
    });

    if (existingLesson) {
      throw new ConflictException('Занятие с таким порядковым номером уже существует в дисциплине');
    }

    const lesson = this.lessonsRepository.create({
      disciplineId: createLessonDto.discipline_id,
      name: createLessonDto.name,
      orderNumber: createLessonDto.order_number,
      description: createLessonDto.description,
      lessonType: createLessonDto.lesson_type,
      isActive: true,
      createdBy: { id: createdByUserId } as any,
      discipline: discipline,
    });

    const savedLesson = await this.lessonsRepository.save(lesson);
    
    const lessonWithRelations = await this.lessonsRepository.findOne({
      where: { id: savedLesson.id },
      relations: ['discipline', 'discipline.course', 'createdBy'],
    });

    return this.toResponseDto(lessonWithRelations);
  }

  async findOne(id: number): Promise<LessonResponseDto> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['discipline', 'discipline.course', 'createdBy', 'links', 'texts', 'attachments'],
    });

    if (!lesson) {
      throw new NotFoundException('Занятие не найдено');
    }

    return this.toResponseDto(lesson);
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<LessonResponseDto> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['discipline', 'discipline.course', 'createdBy'],
    });

    if (!lesson) {
      throw new NotFoundException('Занятие не найдено');
    }

    if (updateLessonDto.order_number !== undefined && updateLessonDto.order_number !== lesson.orderNumber) {
      const existingLesson = await this.lessonsRepository.findOne({
        where: {
          disciplineId: lesson.disciplineId,
          orderNumber: updateLessonDto.order_number,
        },
      });

      if (existingLesson && existingLesson.id !== id) {
        throw new ConflictException('Занятие с таким порядковым номером уже существует в дисциплине');
      }
    }

    if (updateLessonDto.name !== undefined) {
      lesson.name = updateLessonDto.name;
    }

    if (updateLessonDto.order_number !== undefined) {
      lesson.orderNumber = updateLessonDto.order_number;
    }

    if (updateLessonDto.description !== undefined) {
      lesson.description = updateLessonDto.description;
    }

    if (updateLessonDto.lesson_type !== undefined) {
      lesson.lessonType = updateLessonDto.lesson_type;
    }

    if (updateLessonDto.is_active !== undefined) {
      lesson.isActive = updateLessonDto.is_active;
    }

    const updatedLesson = await this.lessonsRepository.save(lesson);
    return this.toResponseDto(updatedLesson);
  }

  private toResponseDto(lesson: Lesson): LessonResponseDto {
    return {
      id: lesson.id,
      name: lesson.name,
      order_number: lesson.orderNumber,
      description: lesson.description,
      lesson_type: lesson.lessonType,
      is_active: lesson.isActive,
      created_by: lesson.createdBy?.id || null,
      discipline: this.disciplineToResponseDto(lesson.discipline),

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
}