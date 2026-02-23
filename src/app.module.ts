import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatoonsModule } from './platoons/platoons.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { LessonsModule } from './lessons/lessons.module';
import {LessonMaterialsModule} from './lesson-materials/materials.module'
import { ormConfig } from './config/ormconfig';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UsersModule,
    PlatoonsModule,
    CoursesModule,
    DisciplinesModule,
    LessonsModule,
    LessonMaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}