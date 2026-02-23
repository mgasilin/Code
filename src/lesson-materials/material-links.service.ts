import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialLink } from '../entities/material-link.entity';
import { Lesson } from '../entities/lesson.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinkResponseDto } from './dto/link-response.dto';

@Injectable()
export class MaterialLinksService {
  constructor(
    @InjectRepository(MaterialLink)
    private linksRepository: Repository<MaterialLink>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async create(lessonId: number, dto: CreateLinkDto): Promise<LinkResponseDto> {
    const lesson = await this.lessonsRepository.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Занятие с ID ${lessonId} не найдено`);
    }

    const link = this.linksRepository.create({
      lessonId,
      linkType: dto.link_type,
      url: dto.url,
      title: dto.title || null,
      description: dto.description || null,
    });

    const savedLink = await this.linksRepository.save(link);
    return this.toResponseDto(savedLink);
  }

  async findByLesson(lessonId: number): Promise<LinkResponseDto[]> {
    const links = await this.linksRepository.find({
      where: { lessonId },
      order: { createdAt: 'DESC' },
    });
    return links.map(link => this.toResponseDto(link));
  }

  async findOne(id: number): Promise<LinkResponseDto> {
    const link = await this.linksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Ссылка с ID ${id} не найдена`);
    }
    return this.toResponseDto(link);
  }

  async update(id: number, dto: UpdateLinkDto): Promise<LinkResponseDto> {
    const link = await this.linksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Ссылка с ID ${id} не найдена`);
    }

    if (dto.link_type !== undefined) link.linkType = dto.link_type;
    if (dto.url !== undefined) link.url = dto.url;
    if (dto.title !== undefined) link.title = dto.title;
    if (dto.description !== undefined) link.description = dto.description;

    const updatedLink = await this.linksRepository.save(link);
    return this.toResponseDto(updatedLink);
  }

  async remove(id: number): Promise<void> {
    const result = await this.linksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ссылка с ID ${id} не найдена`);
    }
  }

  private toResponseDto(link: MaterialLink): LinkResponseDto {
    return {
      id: link.id,
      lesson_id: link.lessonId,
      link_type: link.linkType,
      url: link.url,
      title: link.title,
      description: link.description,
      created_at: link.createdAt,
    };
  }
}