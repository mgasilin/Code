import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialText } from '../entities/material-text.entity';
import { Lesson } from '../entities/lesson.entity';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { TextResponseDto } from './dto/text-response.dto';

@Injectable()
export class MaterialTextsService {
  constructor(
    @InjectRepository(MaterialText)
    private textsRepository: Repository<MaterialText>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async create(lessonId: number, dto: CreateTextDto): Promise<TextResponseDto> {
    const lesson = await this.lessonsRepository.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Занятие с ID ${lessonId} не найдено`);
    }

    let orderNumber = dto.order_number;
    if (!orderNumber) {
      const lastText = await this.textsRepository.findOne({
        where: { lessonId },
        order: { orderNumber: 'DESC' },
      });
      orderNumber = (lastText?.orderNumber || 0) + 1;
    }

    const text = this.textsRepository.create({
      lessonId,
      title: dto.title,
      materialText: dto.content,
      orderNumber,
    });

    const savedText = await this.textsRepository.save(text);
    return this.toResponseDto(savedText);
  }

  async findByLesson(lessonId: number): Promise<TextResponseDto[]> {
    const texts = await this.textsRepository.find({
      where: { lessonId },
      order: { orderNumber: 'ASC' },
    });
    return texts.map(text => this.toResponseDto(text));
  }

  async findOne(id: number): Promise<TextResponseDto> {
    const text = await this.textsRepository.findOne({ where: { id } });
    if (!text) {
      throw new NotFoundException(`Текст с ID ${id} не найден`);
    }
    return this.toResponseDto(text);
  }

  async update(id: number, dto: UpdateTextDto): Promise<TextResponseDto> {
    const text = await this.textsRepository.findOne({ where: { id } });
    if (!text) {
      throw new NotFoundException(`Текст с ID ${id} не найден`);
    }

    if (dto.title !== undefined) text.title = dto.title;
    if (dto.content !== undefined) text.materialText = dto.content;
    if (dto.order_number !== undefined) text.orderNumber = dto.order_number;

    const updatedText = await this.textsRepository.save(text);
    return this.toResponseDto(updatedText);
  }

  async remove(id: number): Promise<void> {
    const result = await this.textsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Текст с ID ${id} не найден`);
    }
  }

  private toResponseDto(text: MaterialText): TextResponseDto {
    return {
      id: text.id,
      lesson_id: text.lessonId,
      title: text.title,
      content: text.materialText,
      order_number: text.orderNumber,
      created_at: text.createdAt,
    };
  }
}