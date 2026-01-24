import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatoonsController } from './platoons.controller';
import { PlatoonsService } from './platoons.service';
import { Platoon } from '../entities/platoon.entity';
import { Course } from '../entities/course.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Platoon, Course]), 
  ],
  controllers: [PlatoonsController],
  providers: [PlatoonsService],
  exports: [PlatoonsService],
})
export class PlatoonsModule {}