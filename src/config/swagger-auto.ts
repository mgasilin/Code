import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

export function setupSwagger(app: Express) {
  const options = {
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
        schemas: {
          // Схемы будут подхватываться автоматически из JSDoc
        },
      },
    },
    // Автоматически ищем JSDoc во всех файлах
    apis: [
      path.join(__dirname, '../modules/**/*.controller.ts'),
      path.join(__dirname, '../routes/**/*.ts'),
      path.join(__dirname, '../entities/*.ts'), // Entity для схем
    ],
  };

  const specs = swaggerJSDoc(options);
  
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  console.log('📚 Swagger documentation available at /api-docs');
}