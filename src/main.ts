import 'reflect-metadata';
import app from './app';
import { AppDataSource } from '../ormconfig';
import { setupSwagger } from './config/swagger-auto';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // Автоматическая настройка Swagger
    setupSwagger(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();