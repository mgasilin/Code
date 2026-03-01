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
     'group', p_teacher_id);
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


INSERT INTO material_texts (lesson_id, order_number, title, material_text)
SELECT 
    l.id,
    1,
    'Теоретический материал: ' || l.name,
    '<h1>Основной теоретический материал</h1>' ||
    '<p>Это содержимое теоретического материала для занятия "' || l.name || 
    '" в рамках дисциплины ' || d.name || '.</p>' ||
    '<p>Материал включает специализированные разделы, соответствующие направлению подготовки.</p>'
FROM lessons l
JOIN disciplines d ON l.discipline_id = d.id;


INSERT INTO material_links (lesson_id, link_type, url, title, description)
SELECT 
    l.id,
    CASE 
        WHEN l.lesson_type = 'group' THEN 'test_module'
        ELSE 'external'
    END,
    CASE 
        WHEN l.lesson_type = 'group' THEN '/tests/' || l.id::text || '/start'
        ELSE 'https://library.mil.ru/' || l.id::text
    END,
    CASE 
        WHEN l.lesson_type = 'group' THEN 'Модуль тестирования: ' || l.name
        ELSE 'Библиотека ВУЦ: ' || l.name
    END,
    CASE 
        WHEN l.lesson_type = 'group' THEN 'Перейти к прохождению итогового тестирования'
        ELSE 'Дополнительные материалы в библиотеке ВУЦ'
    END
FROM lessons l
WHERE l.lesson_type IN ('theory', 'practics', 'group');


-- ============================================================================
-- 8. СОЗДАНИЕ ПРИКРЕПЛЕННЫХ ФАЙЛОВ
-- ============================================================================

INSERT INTO material_attachments (lesson_id, file_name, file_type, file_path, file_size, uploaded_by)
SELECT 
    l.id,
    'lecture_notes_' || l.id::text || '.pdf' as file_name,
    'application/pdf' as file_type,
    '/storage/lessons/' || l.id::text || '/lecture.pdf',
    1048576, -- 1MB
    1
FROM lessons l
WHERE l.lesson_type IN ('theory', 'practics', 'group')
UNION ALL
SELECT 
    l.id,
    'additional_materials_' || l.id::text || '.zip' as file_name,
    'application/zip' as file_type,
    '/storage/lessons/' || l.id::text || '/additional.zip',
    2097152, -- 2MB
    1
FROM lessons l
WHERE l.lesson_type IN ('theory', 'practics');



-- ============================================================================
-- ВЫВОД СТАТИСТИКИ ПО ЗАПОЛНЕННЫМ ДАННЫМ
-- ============================================================================

SELECT 'Направления подготовки', COUNT(*) from cources
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
SELECT 'Прикрепленные файлы', COUNT(*) FROM material_attachments;

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
    COUNT(DISTINCT mt.id) as texts_count,
    COUNT(DISTINCT ml.id) as links_count,
    COUNT(DISTINCT ma.id) as attachments_count
FROM cources c
JOIN disciplines d ON d.cource_id = c.id
JOIN lessons l ON l.discipline_id = d.id
LEFT JOIN material_texts mt ON mt.lesson_id = l.id
LEFT JOIN material_links ml ON ml.lesson_id = l.id
LEFT JOIN material_attachments ma ON ma.lesson_id = l.id
GROUP BY c.name, d.name, d.year_of_study, l.name, l.lesson_type, l.order_number
ORDER BY c.name, d.year_of_study, l.order_number;


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


-- 3. Статистика по направлениям
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


-- 4. Пример получения всех материалов для конкретного занятия
SELECT 
    l.name as lesson_name,
    l.lesson_type,
    json_build_object(
        'texts', (SELECT json_agg(json_build_object('id', mt.id, 'title', mt.title)) 
                  FROM material_texts mt WHERE mt.lesson_id = l.id),
        'links', (SELECT json_agg(json_build_object('id', ml.id, 'title', ml.title, 'url', ml.url)) 
                  FROM material_links ml WHERE ml.lesson_id = l.id),
        'attachments', (SELECT json_agg(json_build_object('id', ma.id, 'file_name', ma.file_name)) 
                        FROM material_attachments ma WHERE ma.lesson_id = l.id)
    ) as materials
FROM lessons l
WHERE l.id = 1;

-- ============================================================================
-- КОНЕЦ СКРИПТА ЗАПОЛНЕНИЯ ДАННЫМИ
-- ============================================================================ 