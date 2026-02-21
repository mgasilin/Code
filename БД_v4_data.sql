-- ============================================================================
-- СКРИПТ ЗАПОЛНЕНИЯ БАЗЫ ДАННЫХ UMK ТЕСТОВЫМИ ДАННЫМИ
-- Учебно-методический комплекс Военного учебного центра
-- Версия: 1.2 (с привязкой взводов к направлениям)
-- Дата: 27 октября 2025
-- ============================================================================

-- Устанавливаем схему по умолчанию
SET search_path TO dev_data;

-- ============================================================================
-- 1. СОЗДАНИЕ НАПРАВЛЕНИЙ ПОДГОТОВКИ (COURCES)
-- ============================================================================

INSERT INTO cources (name, description, created_at, is_active) VALUES
('АСО', 'Автоматизированные системы охраны', CURRENT_TIMESTAMP, TRUE),
('ЗИТ', 'Защита информационных технологий', CURRENT_TIMESTAMP, TRUE);

-- ============================================================================
-- 2. СОЗДАНИЕ ВЗВОДОВ С ПРИВЯЗКОЙ К НАПРАВЛЕНИЯМ
-- ============================================================================

-- Взводы для направления АСО
INSERT INTO platoons (id, cource_id, year_of_study, description) VALUES
('2302', (SELECT id FROM cources WHERE name = 'АСО'), 3, 'Третий год обучения - Направление АСО'),
('2402', (SELECT id FROM cources WHERE name = 'АСО'), 2, 'Второй год обучения - Направление АСО'),
('2502', (SELECT id FROM cources WHERE name = 'АСО'), 1, 'Первый год обучения - Направление АСО');

-- Взводы для направления ЗИТ
INSERT INTO platoons (id, cource_id, year_of_study, description) VALUES
('2301', (SELECT id FROM cources WHERE name = 'ЗИТ'), 3, 'Третий год обучения - Направление ЗИТ'),
('2401', (SELECT id FROM cources WHERE name = 'ЗИТ'), 2, 'Второй год обучения - Направление ЗИТ'),
('2501', (SELECT id FROM cources WHERE name = 'ЗИТ'), 1, 'Первый год обучения - Направление ЗИТ');

-- ============================================================================
-- 3. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================================================

-- Сначала создаем преподавателя для указания в created_by
INSERT INTO users (ldap_uid, phone_number, password_hash, first_name, last_name, patronymic, role, initials) VALUES
('admin', '+79111111111', '$2b$12$u97VtGKwg1BA7Y8YXzb0BeSfVeylMcdjTjN4BCUljG.7H4xjIn/Ay', '', 'Администратор системы', '', 'teacher', 'Админ');

-- Обновляем направления подготовки с указанием created_by
UPDATE cources SET created_by = (SELECT id FROM users WHERE ldap_uid = 'admin');

-- Преподаватели (используют LDAP аутентификацию)
INSERT INTO users (ldap_uid, phone_number, first_name, last_name, patronymic, role, initials) VALUES
('teacher1', '+79110000001', 'Иван', 'Петров', 'Сергеевич', 'teacher', 'И. С.'),
('teacher2', '+79110000002', 'Мария', 'Сидорова', 'Александровна', 'teacher', 'М. С.'),
('teacher3', '+79110000003', 'Алексей', 'Козлов', 'Викторович', 'teacher', 'А. В.');

-- Студенты направления АСО
INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
('+79110000101', 'Александр', 'Иванов', 'Петрович', '2302', 'student', 'А. П.'),
('+79110000102', 'Дмитрий', 'Смирнов', 'Павлович', '2302', 'student', 'Д. П.'),
('+79110000103', 'Екатерина', 'Кузнецова', 'Сергеевна', '2402', 'student', 'Е. С.'),
('+79110000104', 'Ольга', 'Попова', 'Андреевна', '2402', 'student', 'О. А.'),
('+79110000105', 'Сергей', 'Васильев', 'Дмитриевич', '2502', 'student', 'С. Д.'),
('+79110000106', 'Наталья', 'Новикова', 'Игоревна', '2502', 'student', 'Н. И.');

-- Студенты направления ЗИТ
INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
('+79110000201', 'Андрей', 'Морозов', 'Владимирович', '2301', 'student', 'А. В.'),
('+79110000202', 'Татьяна', 'Волкова', 'Олеговна', '2301', 'student', 'Т. О.'),
('+79110000203', 'Павел', 'Алексеев', 'Николаевич', '2401', 'student', 'П. Н.'),
('+79110000204', 'Ирина', 'Лебедева', 'Викторовна', '2401', 'student', 'И. В.'),
('+79110000205', 'Михаил', 'Семенов', 'Анатольевич', '2501', 'student', 'М. А.'),
('+79110000206', 'Елена', 'Егорова', 'Станиславовна', '2501', 'student', 'Е. С.');

-- ============================================================================
-- 4. СОЗДАНИЕ ДИСЦИПЛИН
-- ============================================================================

-- Дисциплины для направления АСО
INSERT INTO disciplines (cource_id, name, description, year_of_study, created_by) VALUES
((SELECT id FROM cources WHERE name = 'АСО'), 'ОВП АСО', 'Общевоенная подготовка - первый год обучения АСО', 1, 1),
((SELECT id FROM cources WHERE name = 'АСО'), 'ТП АСО', 'Тактическая подготовка - первый год обучения АСО', 1, 1),
((SELECT id FROM cources WHERE name = 'АСО'), 'ТСП АСО', 'Тактико-специальная подготовка - второй год обучения АСО', 2, 1),
((SELECT id FROM cources WHERE name = 'АСО'), 'ТСП АСО', 'Тактико-специальная подготовка - третий год обучения АСО', 3, 1),
((SELECT id FROM cources WHERE name = 'АСО'), 'ВСП АСО', 'Военно-специальная подготовка - второй год обучения АСО', 2, 1),
((SELECT id FROM cources WHERE name = 'АСО'), 'ВСП АСО', 'Военно-специальная подготовка - третий год обучения АСО', 3, 1);

-- Дисциплины для направления ЗИТ
INSERT INTO disciplines (cource_id, name, description, year_of_study, created_by) VALUES
((SELECT id FROM cources WHERE name = 'ЗИТ'), 'ОВП ЗИТ', 'Общевоенная подготовка - первый год обучения ЗИТ', 1, 1),
((SELECT id FROM cources WHERE name = 'ЗИТ'), 'ТП ЗИТ', 'Тактическая подготовка - первый год обучения ЗИТ', 1, 1),
((SELECT id FROM cources WHERE name = 'ЗИТ'), 'ТСП ЗИТ', 'Тактико-специальная подготовка - второй год обучения ЗИТ', 2, 1),
((SELECT id FROM cources WHERE name = 'ЗИТ'), 'ВСП ЗИТ', 'Военно-специальная подготовка - третий год обучения ЗИТ', 3, 1),
((SELECT id FROM cources WHERE name = 'ЗИТ'), 'ТСП ЗИТ', 'Тактико-специальная подготовка - второй год обучения ЗИТ', 3, 1),
((SELECT id FROM cources WHERE name = 'ЗИТ'), 'ВСП ЗИТ', 'Военно-специальная подготовка - третий год обучения ЗИТ', 2, 1);

-- ============================================================================
-- 5. СОЗДАНИЕ ЗАНЯТИЙ (LESSONS)
-- ============================================================================

-- Функция для создания занятий для дисциплины
CREATE OR REPLACE FUNCTION create_lessons_for_discipline(
    p_discipline_id INTEGER, 
    p_teacher_id INTEGER,
    p_discipline_name VARCHAR
) RETURNS VOID AS $$
BEGIN
    -- Теоретические занятия с уникальным контентом для каждой дисциплины
    INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
    (p_discipline_id, 'Введение в ' || p_discipline_name, 1, 
     'Основные понятия и задачи дисциплины ' || p_discipline_name || '. Изучение базовых принципов и терминологии.', 
     'theory', p_teacher_id),
    (p_discipline_id, 'Основные принципы ' || p_discipline_name, 2, 
     'Фундаментальные принципы и подходы в ' || p_discipline_name || '. Анализ ключевых концепций.', 
     'theory', p_teacher_id),
    (p_discipline_id, 'Практическое применение ' || p_discipline_name, 3, 
     'Реальные кейсы и примеры использования знаний по ' || p_discipline_name || ' в практической деятельности.', 
     'practics', p_teacher_id);
    
    -- Тестовое занятие
    INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
    (p_discipline_id, 'Итоговый тест по ' || p_discipline_name, 4, 
     'Контрольное тестирование по пройденному материалу дисциплины ' || p_discipline_name || '.', 
     'test', p_teacher_id);
END;
$$ LANGUAGE plpgsql;

-- Создаем занятия для всех дисциплин АСО
SELECT create_lessons_for_discipline(1, 1, 'ОВП АСО');
SELECT create_lessons_for_discipline(2, 1, 'ТП АСО');
SELECT create_lessons_for_discipline(3, 1, 'ТСП АСО');
SELECT create_lessons_for_discipline(4, 1, 'ТСП АСО');
SELECT create_lessons_for_discipline(5, 2, 'ВСП АСО');
SELECT create_lessons_for_discipline(6, 2, 'ВСП АСО');

-- Создаем занятия для всех дисциплин ЗИТ
SELECT create_lessons_for_discipline(7, 3, 'ОВП ЗИТ');
SELECT create_lessons_for_discipline(8, 3, 'ТП ЗИТ');
SELECT create_lessons_for_discipline(9, 3, 'ТСП ЗИТ');
SELECT create_lessons_for_discipline(10, 2, 'ВСП ЗИТ');
SELECT create_lessons_for_discipline(11, 3, 'ТСП ЗИТ');
SELECT create_lessons_for_discipline(12, 2, 'ВСП ЗИТ');

-- Удаляем временную функцию
DROP FUNCTION create_lessons_for_discipline(INTEGER, INTEGER, VARCHAR);

-- ============================================================================
-- 6. СОЗДАНИЕ УЧЕБНЫХ МАТЕРИАЛОВ
-- ============================================================================

-- Функция для создания материалов для занятия
CREATE OR REPLACE FUNCTION create_materials_for_lesson(
    p_lesson_id INTEGER,
    p_teacher_id INTEGER,
    p_lesson_name VARCHAR,
    p_discipline_name VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_lesson_type VARCHAR;
BEGIN
    -- Получаем тип занятия
    SELECT lesson_type INTO v_lesson_type FROM lessons WHERE id = p_lesson_id;
    
    IF v_lesson_type = 'test' THEN
        -- Для тестового занятия создаем ссылку на тест
        INSERT INTO materials (lesson_id, title, material_type, content, created_by) VALUES
        (p_lesson_id, 'Ссылка на тестирование по ' || p_discipline_name, 'test_link', 
         'Перейдите по ссылке для прохождения итогового теста по дисциплине ' || p_discipline_name, 
         p_teacher_id);
    ELSE
        -- Для теоретических/практических занятий создаем материалы с уникальным контентом
        INSERT INTO materials (lesson_id, title, material_type, content, created_by) VALUES
        (p_lesson_id, 'Теоретический материал: ' || p_lesson_name, 'theory', 
         '<h1>Основной теоретический материал по ' || p_discipline_name || '</h1>' ||
         '<p>Это уникальное содержимое теоретического материала для занятия "' || p_lesson_name || 
         '" в рамках дисциплины ' || p_discipline_name || '.</p>' ||
         '<p>Материал включает специализированные разделы, соответствующие направлению подготовки.</p>', 
         p_teacher_id),
        (p_lesson_id, 'Дополнительные материалы: ' || p_lesson_name, 'file', 
         'Файл с дополнительными материалами и примерами для занятия "' || p_lesson_name || 
         '" по дисциплине ' || p_discipline_name, 
         p_teacher_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Создаем материалы для всех занятий
DO $$
DECLARE
    lesson_record RECORD;
    discipline_name VARCHAR;
BEGIN
    FOR lesson_record IN 
        SELECT l.id, l.name as lesson_name, d.name as discipline_name 
        FROM lessons l 
        JOIN disciplines d ON l.discipline_id = d.id 
        ORDER BY l.id
    LOOP
        PERFORM create_materials_for_lesson(
            lesson_record.id, 
            1, 
            lesson_record.lesson_name,
            lesson_record.discipline_name
        );
    END LOOP;
END $$;

-- Удаляем временную функцию
DROP FUNCTION create_materials_for_lesson(INTEGER, INTEGER, VARCHAR, VARCHAR);

-- ============================================================================
-- 7. СОЗДАНИЕ ТЕСТОВ
-- ============================================================================

-- Создаем тесты для тестовых занятий
INSERT INTO tests (lesson_id, external_test_id, test_name, description, test_link, is_active)
SELECT 
    l.id,
    'EXT_TEST_' || l.id::text,
    'Итоговый тест: ' || d.name,
    'Итоговый контрольный тест по дисциплине ' || d.name || '. Проверка знаний и практических навыков.',
    '/tests/' || l.id::text || '/start',
    TRUE
FROM lessons l
JOIN disciplines d ON l.discipline_id = d.id
WHERE l.lesson_type = 'test';

-- ============================================================================
-- 8. СОЗДАНИЕ ПРИКРЕПЛЕННЫХ ФАЙЛОВ
-- ============================================================================

-- Добавляем прикрепленные файлы к материалам
INSERT INTO material_attachments (material_id, file_name, file_type, file_path, file_size, uploaded_by)
SELECT 
    m.id,
    CASE 
        WHEN m.material_type = 'theory' THEN 'lecture_notes_' || m.id::text || '.pdf'
        ELSE 'additional_materials_' || m.id::text || '.zip'
    END as file_name,
    CASE 
        WHEN m.material_type = 'theory' THEN 'application/pdf'
        ELSE 'application/zip'
    END as file_type,
    '/storage/materials/' || m.id::text || '/file',
    1048576, -- 1MB
    1
FROM materials m
WHERE m.material_type IN ('theory', 'file');

-- ============================================================================
-- 9. СОЗДАНИЕ КАЛЬКУЛЯТОРОВ ФОРМУЛ
-- ============================================================================

-- Калькуляторы для тестов АСО
INSERT INTO test_calculators (lesson_id, test_id, name, description, formula_config, display_order, created_by) 
SELECT 
    l.id,
    t.id,
    'Калькулятор систем охраны для ' || d.name,
    'Специализированный калькулятор для расчетов параметров систем охраны',
    '{"variables": ["coverage", "sensitivity"], "formula": "coverage * sensitivity * 0.85", "labels": {"coverage": "Зона покрытия (м²)", "sensitivity": "Чувствительность"}, "units": {"result": "индекс эффективности"}}'::jsonb,
    1,
    1
FROM lessons l
JOIN disciplines d ON l.discipline_id = d.id
LEFT JOIN tests t ON t.lesson_id = l.id
WHERE d.cource_id = (SELECT id FROM cources WHERE name = 'АСО') AND l.lesson_type = 'test';

-- Калькуляторы для тестов ЗИТ
INSERT INTO test_calculators (lesson_id, test_id, name, description, formula_config, display_order, created_by) 
SELECT 
    l.id,
    t.id,
    'Калькулятор защиты информации для ' || d.name,
    'Специализированный калькулятор для расчетов параметров защиты информации',
    '{"variables": ["threat_level", "protection"], "formula": "threat_level * protection / 100", "labels": {"threat_level": "Уровень угрозы", "protection": "Уровень защиты (%)"}, "units": {"result": "коэффициент безопасности"}}'::jsonb,
    1,
    1
FROM lessons l
JOIN disciplines d ON l.discipline_id = d.id
LEFT JOIN tests t ON t.lesson_id = l.id
WHERE d.cource_id = (SELECT id FROM cources WHERE name = 'ЗИТ') AND l.lesson_type = 'test';

-- ============================================================================
-- 10. НАСТРОЙКА ПРАВИЛ ВИДИМОСТИ
-- ============================================================================

-- Настраиваем видимость контента по взводам (связь по курсу и году обучения)
INSERT INTO visibility_rules_lessons (lesson_id, platoon_id, is_visible, visible_from, visible_until, created_by)
SELECT 
    l.id,
    p.id,
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '1 year',
    1
FROM lessons l
JOIN disciplines d ON l.discipline_id = d.id
CROSS JOIN platoons p
WHERE p.cource_id = d.cource_id 
  AND p.year_of_study = d.year_of_study;

-- ============================================================================
-- 11. СОЗДАНИЕ СВЯЗЕЙ ТЕСТ-МАТЕРИАЛЫ
-- ============================================================================

-- Связываем подготовительные материалы с тестами (в рамках одного направления)
INSERT INTO test_materials (lesson_id, material_id, order_number, is_required, created_by)
SELECT 
    test_lesson.id,
    prep_material.id,
    1,
    TRUE,
    1
FROM lessons test_lesson
JOIN disciplines d ON test_lesson.discipline_id = d.id
JOIN lessons prep_lesson ON prep_lesson.discipline_id = d.id AND prep_lesson.lesson_type != 'test'
JOIN materials prep_material ON prep_material.lesson_id = prep_lesson.id
WHERE test_lesson.lesson_type = 'test'
AND prep_material.material_type = 'theory';

-- ============================================================================
-- ВЫВОД СТАТИСТИКИ ПО ЗАПОЛНЕННЫМ ДАННЫМ
-- ============================================================================

SELECT 'Направления подготовки' as category, COUNT(*) as count FROM cources
UNION ALL
SELECT 'Дисциплины', COUNT(*) FROM disciplines
UNION ALL
SELECT 'Взводы', COUNT(*) FROM platoons
UNION ALL
SELECT 'Пользователи', COUNT(*) FROM users
UNION ALL
SELECT 'Преподаватели', COUNT(*) FROM users WHERE role = 'teacher'
UNION ALL
SELECT 'Студенты', COUNT(*) FROM users WHERE role = 'student'
UNION ALL
SELECT 'Занятия', COUNT(*) FROM lessons
UNION ALL
SELECT 'Учебные материалы', COUNT(*) FROM materials
UNION ALL
SELECT 'Тесты', COUNT(*) FROM tests
UNION ALL
SELECT 'Прикрепленные файлы', COUNT(*) FROM material_attachments
UNION ALL
SELECT 'Правила видимости', COUNT(*) FROM visibility_rules_lessons
ORDER BY category;

-- ============================================================================
-- ПРОВЕРКА СВЯЗЕЙ С НОВОЙ СТРУКТУРОЙ
-- ============================================================================

-- 1. Проверяем привязку взводов к направлениям
SELECT 
    p.id as platoon_id,
    p.year_of_study,
    c.name as cource_name,
    COUNT(u.id) as students_count
FROM platoons p
JOIN cources c ON p.cource_id = c.id
LEFT JOIN users u ON p.id = u.platoon_id AND u.role = 'student'
GROUP BY p.id, p.year_of_study, c.name
ORDER BY c.name, p.year_of_study DESC;

-- 2. Проверяем иерархию направление->дисциплина->занятие->материал
SELECT 
    c.name as direction,
    d.name as discipline,
    d.year_of_study as year,
    l.name as lesson,
    l.lesson_type as type,
    m.title as material,
    m.material_type as material_type
FROM cources c
JOIN disciplines d ON d.cource_id = c.id
JOIN lessons l ON l.discipline_id = d.id
JOIN materials m ON m.lesson_id = l.id
ORDER BY c.name, d.year_of_study, l.order_number, m.id;

-- 3. Проверяем правила видимости с учетом направлений
SELECT 
    c.name as cource_name,
    p.id as platoon_id,
    p.year_of_study,
    COUNT(DISTINCT vr.lesson_id) as visible_lessons,
    STRING_AGG(DISTINCT d.name, ', ') as visible_disciplines
FROM cources c
JOIN platoons p ON c.id = p.cource_id
LEFT JOIN visibility_rules_lessons vr ON p.id = vr.platoon_id
LEFT JOIN lessons l ON vr.lesson_id = l.id
LEFT JOIN disciplines d ON l.discipline_id = d.id
GROUP BY c.name, p.id, p.year_of_study
ORDER BY c.name, p.year_of_study DESC;

-- ============================================================================
-- ПРИМЕРЫ ЗАПРОСОВ С ПРИВЯЗКОЙ К НАПРАВЛЕНИЯМ
-- ============================================================================

-- 1. Получить все занятия для направления АСО
SELECT 
    c.name as cource_name,
    d.name as discipline_name,
    l.name as lesson_name,
    l.lesson_type
FROM cources c
JOIN disciplines d ON c.id = d.cource_id
JOIN lessons l ON d.id = l.discipline_id
WHERE c.name = 'АСО'
ORDER BY d.year_of_study, l.order_number;

-- 2. Получить всех студентов направления ЗИТ
SELECT 
    u.first_name,
    u.last_name,
    u.patronymic,
    u.phone_number,
    p.id as platoon_id,
    p.year_of_study,
    c.name as cource_name
FROM users u
JOIN platoons p ON u.platoon_id = p.id
JOIN cources c ON p.cource_id = c.id
WHERE c.name = 'ЗИТ' AND u.role = 'student'
ORDER BY p.year_of_study DESC, u.last_name;

-- 3. Получить материалы для взвода 2402 (АСО, 2 курс)
SELECT 
    m.title as material_title,
    m.material_type,
    l.name as lesson_name,
    d.name as discipline_name,
    c.name as cource_name
FROM materials m
JOIN lessons l ON m.lesson_id = l.id
JOIN disciplines d ON l.discipline_id = d.id
JOIN cources c ON d.cource_id = c.id
JOIN visibility_rules_lessons vr ON vr.lesson_id = l.id
WHERE vr.platoon_id = '2402'
  AND vr.is_visible = TRUE
ORDER BY l.order_number, m.id;

-- 4. Статистика по направлениям
SELECT 
    c.name as cource_name,
    COUNT(DISTINCT p.id) as platoons_count,
    COUNT(DISTINCT u.id) as students_count,
    COUNT(DISTINCT d.id) as disciplines_count,
    COUNT(DISTINCT l.id) as lessons_count
FROM cources c
LEFT JOIN platoons p ON c.id = p.cource_id
LEFT JOIN users u ON p.id = u.platoon_id AND u.role = 'student'
LEFT JOIN disciplines d ON c.id = d.cource_id
LEFT JOIN lessons l ON d.id = l.discipline_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- ============================================================================
-- КОНЕЦ СКРИПТА ЗАПОЛНЕНИЯ ДАННЫМИ
-- ============================================================================