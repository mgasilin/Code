import { Options } from 'swagger-jsdoc';
import { generateSchemasFromEntities } from './swagger-schemas';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UMK Backend API',
      version: '1.0.0',
      description: 'API для Учебно-Методического Комплекса Военного учебного центра',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: generateSchemasFromEntities(), // Автоматические схемы
    },
  },
  // Автоматически находим все JSDoc комментарии
  apis: [
    './src/modules/**/*.controller.ts',
    './src/routes/**/*.ts',
    './src/entities/*.ts',
  ],
};

export default swaggerOptions;