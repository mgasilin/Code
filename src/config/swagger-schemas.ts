// Автоматическая генерация схем из Entity классов
export function generateSchemasFromEntities() {
  // Эта функция может динамически читать Entity и генерировать схемы
  // Но для простоты создадим статические схемы на основе наших Entity
  return {
    User: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        phone_number: { type: 'string', example: '+79991234567' },
        first_name: { type: 'string', example: 'Иван' },
        last_name: { type: 'string', example: 'Иванов' },
        patronymic: { type: 'string', example: 'Иванович' },
        email: { type: 'string', example: 'ivanov@example.com' },
        role: { type: 'string', enum: ['student', 'teacher'], example: 'student' },
        platoon_id: { type: 'string', example: '101A' },
        is_active: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
    AuthResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
      },
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Invalid credentials' },
      },
    },
  };
}