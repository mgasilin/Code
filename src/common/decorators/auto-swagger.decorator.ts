// Декораторы для автоматической документации Express роутов
export function AutoSwagger(
  options: {
    summary?: string;
    description?: string;
    tags?: string[];
    params?: any[];
    body?: any;
    responses?: any;
    security?: any[];
  } = {}
) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    // Сохраняем метаданные для Swagger
    if (!target.__swagger) target.__swagger = {};
    target.__swagger[propertyName] = options;
    
    return descriptor;
  };
}

// Автоматически генерирует JSDoc из декораторов
export function generateJSDocFromDecorators(controller: any): string {
  let jsdoc = '';
  
  if (controller.__swagger) {
    Object.entries(controller.__swagger).forEach(([methodName, config]: [string, any]) => {
      jsdoc += `\n/**\n`;
      if (config.summary) jsdoc += ` * ${config.summary}\n`;
      if (config.description) jsdoc += ` * ${config.description}\n`;
      
      // Генерируем параметры
      if (config.params) {
        config.params.forEach((param: any) => {
          jsdoc += ` * @param {${param.type}} ${param.name} - ${param.description}\n`;
        });
      }
      
      // Генерируем ответы
      if (config.responses) {
        Object.entries(config.responses).forEach(([code, response]: [string, any]) => {
          jsdoc += ` * @returns {${response.type}} ${response.description}\n`;
        });
      }
      
      jsdoc += ` */\n`;
    });
  }
  
  return jsdoc;
}