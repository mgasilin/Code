-- ============================================================================
-- СКРИПТ ЗАПОЛНЕНИЯ БАЗЫ ДАННЫХ UMK ТЕСТОВЫМИ ДАННЫМИ
-- Учебно-методический комплекс Военного учебного центра
-- Версия: 2.2 (исправленная)
-- Дата: 27 октября 2025
-- ============================================================================

-- Устанавливаем схему по умолчанию
SET search_path TO dev_data;

-- ============================================================================
-- 1. СОЗДАНИЕ НАПРАВЛЕНИЙ ПОДГОТОВКИ (COURCES)
-- ============================================================================

INSERT INTO cources (name, description, created_at, is_active) VALUES
('ИПБ', 'Информационное противоборство', CURRENT_TIMESTAMP, TRUE),
('АСО', 'Автоматизированные системы охраны', CURRENT_TIMESTAMP, TRUE);

-- ============================================================================
-- 2. СОЗДАНИЕ ВЗВОДОВ С ПРИВЯЗКОЙ К НАПРАВЛЕНИЯМ
-- ============================================================================

-- Взводы для направления ИПБ (по 2 взвода на курс)
INSERT INTO platoons (id, cource_id, year_of_study, description) VALUES
('2301', (SELECT id FROM cources WHERE name = 'ИПБ'), 3, '3 курс - Направление ИПБ, взвод 1'),
('2302', (SELECT id FROM cources WHERE name = 'ИПБ'), 3, '3 курс - Направление ИПБ, взвод 2'),
('2401', (SELECT id FROM cources WHERE name = 'ИПБ'), 2, '2 курс - Направление ИПБ, взвод 1'),
('2402', (SELECT id FROM cources WHERE name = 'ИПБ'), 2, '2 курс - Направление ИПБ, взвод 2'),
('2501', (SELECT id FROM cources WHERE name = 'ИПБ'), 1, '1 курс - Направление ИПБ, взвод 1'),
('2502', (SELECT id FROM cources WHERE name = 'ИПБ'), 1, '1 курс - Направление ИПБ, взвод 2');

-- Взводы для направления АСО (по 2 взвода на курс)
INSERT INTO platoons (id, cource_id, year_of_study, description) VALUES
('2303', (SELECT id FROM cources WHERE name = 'АСО'), 3, '3 курс - Направление АСО, взвод 1'),
('2304', (SELECT id FROM cources WHERE name = 'АСО'), 3, '3 курс - Направление АСО, взвод 2'),
('2403', (SELECT id FROM cources WHERE name = 'АСО'), 2, '2 курс - Направление АСО, взвод 1'),
('2404', (SELECT id FROM cources WHERE name = 'АСО'), 2, '2 курс - Направление АСО, взвод 2'),
('2503', (SELECT id FROM cources WHERE name = 'АСО'), 1, '1 курс - Направление АСО, взвод 1'),
('2504', (SELECT id FROM cources WHERE name = 'АСО'), 1, '1 курс - Направление АСО, взвод 2');

-- ============================================================================
-- 3. СОЗДАНИЕ АДМИНИСТРАТОРА
-- ============================================================================

INSERT INTO users (ldap_uid, phone_number, password_hash, first_name, last_name, patronymic, role, initials) VALUES
('admin', '+79111111111', '$2b$12$u97VtGKwg1BA7Y8YXzb0BeSfVeylMcdjTjN4BCUljG.7H4xjIn/Ay', '', 'Администратор системы', '', 'teacher', 'А. С.');

-- ============================================================================
-- 4. СОЗДАНИЕ ФУНКЦИИ ДЛЯ ЗАНЯТИЙ (ВНЕ БЛОКА DO)
-- ============================================================================

-- Удаляем функцию, если она существует
DROP FUNCTION IF EXISTS create_lessons_for_discipline(VARCHAR, BOOLEAN, INTEGER);

-- Создаем функцию
CREATE OR REPLACE FUNCTION create_lessons_for_discipline(
    p_discipline_name VARCHAR,
    p_is_vsp BOOLEAN,
    p_admin_id INTEGER
) RETURNS VOID AS $$
DECLARE
    v_discipline_id INTEGER;
    v_topic1 VARCHAR;
    v_topic2 VARCHAR;
BEGIN
    -- Получаем ID дисциплины
    SELECT id INTO v_discipline_id FROM disciplines WHERE name = p_discipline_name;
    
    -- Определяем темы для занятий
    IF p_discipline_name = 'ОВП-1' THEN
        v_topic1 := 'Основы военной службы';
        v_topic2 := 'Воинская дисциплина и уставы';
    ELSIF p_discipline_name = 'ОВП-2' THEN
        v_topic1 := 'Строевые приемы и движение';
        v_topic2 := 'Строи подразделений';
    ELSIF p_discipline_name = 'ОВП-3' THEN
        v_topic1 := 'Меры безопасности при обращении с оружием';
        v_topic2 := 'Основы и правила стрельбы';
    ELSIF p_discipline_name = 'ТП' THEN
        v_topic1 := 'Основы общевойскового боя';
        v_topic2 := 'Управление подразделениями в бою';
    ELSIF p_discipline_name = 'ОВП-4' THEN
        v_topic1 := 'Первая помощь в боевых условиях';
        v_topic2 := 'Эвакуация раненых';
    ELSIF p_discipline_name LIKE 'ТСП%' THEN
        v_topic1 := 'Теоретические основы специальной подготовки';
        v_topic2 := 'Практическое применение специальных средств';
    ELSE -- ВСП
        v_topic1 := 'Специальное оборудование и средства';
        v_topic2 := 'Организация специальных работ';
    END IF;
    
    -- Для ВСП: лекция + групповое занятие + 2 практических
    IF p_is_vsp THEN
        -- Тема 1
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Лекция: ' || v_topic1, 1, 
         'Лекционное занятие по теме: ' || v_topic1 || '. Изучение теоретических основ.', 
         'theory', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Групповое занятие: ' || v_topic1, 2, 
         'Групповое обсуждение и решение ситуационных задач по теме: ' || v_topic1, 
         'group', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Практическое занятие 1: ' || v_topic1, 3, 
         'Отработка практических навыков по теме: ' || v_topic1 || ' (часть 1)', 
         'practics', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Практическое занятие 2: ' || v_topic1, 4, 
         'Отработка практических навыков по теме: ' || v_topic1 || ' (часть 2)', 
         'practics', p_admin_id);
        
        -- Тема 2
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Лекция: ' || v_topic2, 5, 
         'Лекционное занятие по теме: ' || v_topic2 || '. Изучение теоретических основ.', 
         'theory', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Групповое занятие: ' || v_topic2, 6, 
         'Групповое обсуждение и решение ситуационных задач по теме: ' || v_topic2, 
         'group', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Практическое занятие 1: ' || v_topic2, 7, 
         'Отработка практических навыков по теме: ' || v_topic2 || ' (часть 1)', 
         'practics', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Практическое занятие 2: ' || v_topic2, 8, 
         'Отработка практических навыков по теме: ' || v_topic2 || ' (часть 2)', 
         'practics', p_admin_id);
        
    -- Для остальных: лекция + 2 групповых на тему (2 темы) = 6 занятий
    ELSE
        -- Тема 1
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Лекция: ' || v_topic1, 1, 
         'Лекционное занятие по теме: ' || v_topic1, 
         'theory', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Групповое занятие 1: ' || v_topic1, 2, 
         'Групповое занятие по теме: ' || v_topic1 || ' (часть 1)', 
         'group', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Групповое занятие 2: ' || v_topic1, 3, 
         'Групповое занятие по теме: ' || v_topic1 || ' (часть 2)', 
         'group', p_admin_id);
        
        -- Тема 2
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Лекция: ' || v_topic2, 4, 
         'Лекционное занятие по теме: ' || v_topic2, 
         'theory', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Групповое занятие 1: ' || v_topic2, 5, 
         'Групповое занятие по теме: ' || v_topic2 || ' (часть 1)', 
         'group', p_admin_id);
        
        INSERT INTO lessons (discipline_id, name, order_number, description, lesson_type, created_by) VALUES
        (v_discipline_id, 'Групповое занятие 2: ' || v_topic2, 6, 
         'Групповое занятие по теме: ' || v_topic2 || ' (часть 2)', 
         'group', p_admin_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. ОСНОВНОЙ БЛОК ЗАПОЛНЕНИЯ ДАННЫМИ
-- ============================================================================

DO $$
DECLARE
    v_admin_id INTEGER;
BEGIN
    -- Получаем ID администратора
    SELECT id INTO v_admin_id FROM users WHERE ldap_uid = 'admin';
    
    -- Обновляем направления подготовки с указанием created_by
    UPDATE cources SET created_by = v_admin_id;
    
    -- ============================================================================
    -- 6. СОЗДАНИЕ СТУДЕНТОВ (мужчины, по 4 человека во взводе)
    -- ============================================================================
    
    -- Студенты ИПБ, 3 курс, взвод 2301
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110100101', 'Александр', 'Иванов', 'Петрович', '2301', 'student', 'А. П.'),
    ('+79110100102', 'Дмитрий', 'Смирнов', 'Павлович', '2301', 'student', 'Д. П.'),
    ('+79110100103', 'Максим', 'Кузнецов', 'Сергеевич', '2301', 'student', 'М. С.'),
    ('+79110100104', 'Артем', 'Попов', 'Андреевич', '2301', 'student', 'А. А.');

    -- Студенты ИПБ, 3 курс, взвод 2302
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110100201', 'Илья', 'Васильев', 'Дмитриевич', '2302', 'student', 'И. Д.'),
    ('+79110100202', 'Кирилл', 'Новиков', 'Игоревич', '2302', 'student', 'К. И.'),
    ('+79110100203', 'Павел', 'Федоров', 'Алексеевич', '2302', 'student', 'П. А.'),
    ('+79110100204', 'Роман', 'Морозов', 'Владимирович', '2302', 'student', 'Р. В.');

    -- Студенты ИПБ, 2 курс, взвод 2401
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110200101', 'Владислав', 'Волков', 'Олегович', '2401', 'student', 'В. О.'),
    ('+79110200102', 'Григорий', 'Алексеев', 'Николаевич', '2401', 'student', 'Г. Н.'),
    ('+79110200103', 'Константин', 'Лебедев', 'Викторович', '2401', 'student', 'К. В.'),
    ('+79110200104', 'Никита', 'Семенов', 'Анатольевич', '2401', 'student', 'Н. А.');

    -- Студенты ИПБ, 2 курс, взвод 2402
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110200201', 'Олег', 'Егоров', 'Станиславович', '2402', 'student', 'О. С.'),
    ('+79110200202', 'Антон', 'Павлов', 'Борисович', '2402', 'student', 'А. Б.'),
    ('+79110200203', 'Вадим', 'Степанов', 'Геннадьевич', '2402', 'student', 'В. Г.'),
    ('+79110200204', 'Виктор', 'Николаев', 'Евгеньевич', '2402', 'student', 'В. Е.');

    -- Студенты ИПБ, 1 курс, взвод 2501
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110300101', 'Георгий', 'Захаров', 'Романович', '2501', 'student', 'Г. Р.'),
    ('+79110300102', 'Даниил', 'Белов', 'Аркадьевич', '2501', 'student', 'Д. А.'),
    ('+79110300103', 'Евгений', 'Тарасов', 'Валентинович', '2501', 'student', 'Е. В.'),
    ('+79110300104', 'Захар', 'Козлов', 'Федорович', '2501', 'student', 'З. Ф.');

    -- Студенты ИПБ, 1 курс, взвод 2502
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110300201', 'Игорь', 'Михайлов', 'Эдуардович', '2502', 'student', 'И. Э.'),
    ('+79110300202', 'Леонид', 'Андреев', 'Юрьевич', '2502', 'student', 'Л. Ю.'),
    ('+79110300203', 'Матвей', 'Макаров', 'Тимофеевич', '2502', 'student', 'М. Т.'),
    ('+79110300204', 'Николай', 'Орлов', 'Григорьевич', '2502', 'student', 'Н. Г.');

    -- Студенты АСО, 3 курс, взвод 2303
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110400301', 'Петр', 'Абрамов', 'Данилович', '2303', 'student', 'П. Д.'),
    ('+79110400302', 'Руслан', 'Григорьев', 'Максимович', '2303', 'student', 'Р. М.'),
    ('+79110400303', 'Семен', 'Давыдов', 'Ильич', '2303', 'student', 'С. И.'),
    ('+79110400304', 'Тимофей', 'Ершов', 'Кириллович', '2303', 'student', 'Т. К.');

    -- Студенты АСО, 3 курс, взвод 2304
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110400401', 'Федор', 'Жуков', 'Леонидович', '2304', 'student', 'Ф. Л.'),
    ('+79110400402', 'Юрий', 'Зайцев', 'Михайлович', '2304', 'student', 'Ю. М.'),
    ('+79110400403', 'Ярослав', 'Исаев', 'Никитич', '2304', 'student', 'Я. Н.'),
    ('+79110400404', 'Борис', 'Крылов', 'Олегович', '2304', 'student', 'Б. О.');

    -- Студенты АСО, 2 курс, взвод 2403
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110500301', 'Валентин', 'Лазарев', 'Павлович', '2403', 'student', 'В. П.'),
    ('+79110500302', 'Виталий', 'Медведев', 'Робертович', '2403', 'student', 'В. Р.'),
    ('+79110500303', 'Геннадий', 'Назаров', 'Станиславович', '2403', 'student', 'Г. С.'),
    ('+79110500304', 'Денис', 'Осипов', 'Тарасович', '2403', 'student', 'Д. Т.');

    -- Студенты АСО, 2 курс, взвод 2404
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110500401', 'Егор', 'Поляков', 'Ульянович', '2404', 'student', 'Е. У.'),
    ('+79110500402', 'Иван', 'Романов', 'Филиппович', '2404', 'student', 'И. Ф.'),
    ('+79110500403', 'Марат', 'Сергеев', 'Харитонович', '2404', 'student', 'М. Х.'),
    ('+79110500404', 'Назар', 'Тихонов', 'Цезаревич', '2404', 'student', 'Н. Ц.');

    -- Студенты АСО, 1 курс, взвод 2503
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110600301', 'Оскар', 'Ушаков', 'Шамильевич', '2503', 'student', 'О. Ш.'),
    ('+79110600302', 'Платон', 'Фомин', 'Щенснович', '2503', 'student', 'П. Щ.'),
    ('+79110600303', 'Роберт', 'Харитонов', 'Эльдарович', '2503', 'student', 'Р. Э.'),
    ('+79110600304', 'Станислав', 'Цветков', 'Юлианович', '2503', 'student', 'С. Ю.');

    -- Студенты АСО, 1 курс, взвод 2504
    INSERT INTO users (phone_number, first_name, last_name, patronymic, platoon_id, role, initials) VALUES
    ('+79110600401', 'Тарас', 'Чернов', 'Яковлевич', '2504', 'student', 'Т. Я.'),
    ('+79110600402', 'Ульян', 'Широков', 'Артемович', '2504', 'student', 'У. А.'),
    ('+79110600403', 'Филипп', 'Щукин', 'Богданович', '2504', 'student', 'Ф. Б.'),
    ('+79110600404', 'Харитон', 'Юдин', 'Владиславович', '2504', 'student', 'Х. В.');

    -- ============================================================================
    -- 7. СОЗДАНИЕ ДИСЦИПЛИН
    -- ============================================================================
    
    -- Общие дисциплины (для обоих направлений)
    INSERT INTO disciplines (name, description, year_of_study, created_by, is_active) VALUES
    ('ОВП-1', 'Общевоенная подготовка - модуль 1: Основы военной службы', 1, v_admin_id, TRUE),
    ('ОВП-2', 'Общевоенная подготовка - модуль 2: Строевая подготовка', 1, v_admin_id, TRUE),
    ('ОВП-3', 'Общевоенная подготовка - модуль 3: Огневая подготовка', 1, v_admin_id, TRUE),
    ('ТП', 'Тактическая подготовка: Основы тактики общевойскового боя', 1, v_admin_id, TRUE),
    ('ОВП-4', 'Общевоенная подготовка - модуль 4: Тактическая медицина', 2, v_admin_id, TRUE);

    -- Специальные дисциплины для ИПБ
    INSERT INTO disciplines (name, description, year_of_study, created_by, is_active) VALUES
    ('ТСП ИПБ-1', 'Тактико-специальная подготовка ИПБ: Основы информационного противоборства', 2, v_admin_id, TRUE),
    ('ТСП ИПБ-2', 'Тактико-специальная подготовка ИПБ: Методы защиты информации', 3, v_admin_id, TRUE),
    ('ВСП ИПБ-1', 'Военно-специальная подготовка ИПБ: Организация информационных операций', 2, v_admin_id, TRUE),
    ('ВСП ИПБ-2', 'Военно-специальная подготовка ИПБ: Кибербезопасность и защита сетей', 3, v_admin_id, TRUE);

    -- Специальные дисциплины для АСО
    INSERT INTO disciplines (name, description, year_of_study, created_by, is_active) VALUES
    ('ТСП АСО-1', 'Тактико-специальная подготовка АСО: Принципы построения АСО', 2, v_admin_id, TRUE),
    ('ТСП АСО-2', 'Тактико-специальная подготовка АСО: Интегрированные системы безопасности', 3, v_admin_id, TRUE),
    ('ВСП АСО-1', 'Военно-специальная подготовка АСО: Эксплуатация систем охраны', 2, v_admin_id, TRUE),
    ('ВСП АСО-2', 'Военно-специальная подготовка АСО: Проектирование АСО', 3, v_admin_id, TRUE);

    -- ============================================================================
    -- 8. СВЯЗИ НАПРАВЛЕНИЙ С ДИСЦИПЛИНАМИ
    -- ============================================================================
    
    -- Общие дисциплины для обоих направлений
    INSERT INTO discipline_cources (cource_id, discipline_id)
    SELECT c.id, d.id
    FROM cources c, disciplines d
    WHERE d.name IN ('ОВП-1', 'ОВП-2', 'ОВП-3', 'ТП', 'ОВП-4')
      AND c.name IN ('ИПБ', 'АСО');

    -- Специальные дисциплины для ИПБ
    INSERT INTO discipline_cources (cource_id, discipline_id)
    SELECT c.id, d.id
    FROM cources c, disciplines d
    WHERE c.name = 'ИПБ' 
      AND d.name IN ('ТСП ИПБ-1', 'ТСП ИПБ-2', 'ВСП ИПБ-1', 'ВСП ИПБ-2');

    -- Специальные дисциплины для АСО
    INSERT INTO discipline_cources (cource_id, discipline_id)
    SELECT c.id, d.id
    FROM cources c, disciplines d
    WHERE c.name = 'АСО' 
      AND d.name IN ('ТСП АСО-1', 'ТСП АСО-2', 'ВСП АСО-1', 'ВСП АСО-2');

    -- ============================================================================
    -- 9. СОЗДАНИЕ ЗАНЯТИЙ (через функцию)
    -- ============================================================================
    
    -- Общие дисциплины
    PERFORM create_lessons_for_discipline('ОВП-1', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ОВП-2', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ОВП-3', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ТП', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ОВП-4', FALSE, v_admin_id);
    
    -- ТСП дисциплины
    PERFORM create_lessons_for_discipline('ТСП ИПБ-1', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ТСП ИПБ-2', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ТСП АСО-1', FALSE, v_admin_id);
    PERFORM create_lessons_for_discipline('ТСП АСО-2', FALSE, v_admin_id);
    
    -- ВСП дисциплины (с расширенной структурой)
    PERFORM create_lessons_for_discipline('ВСП ИПБ-1', TRUE, v_admin_id);
    PERFORM create_lessons_for_discipline('ВСП ИПБ-2', TRUE, v_admin_id);
    PERFORM create_lessons_for_discipline('ВСП АСО-1', TRUE, v_admin_id);
    PERFORM create_lessons_for_discipline('ВСП АСО-2', TRUE, v_admin_id);

    -- ============================================================================
    -- 10. СОЗДАНИЕ ТЕКСТОВЫХ МАТЕРИАЛОВ
    -- ============================================================================
    
    INSERT INTO material_texts (lesson_id, order_number, title, material_text)
    SELECT 
        l.id,
        1,
        'Теоретический материал: ' || l.name,
        '<h1>' || l.name || '</h1>' ||
        '<p>Это содержимое теоретического материала для занятия "' || l.name || 
        '". Материал включает специализированные разделы, соответствующие направлению подготовки.</p>' ||
        '<h2>Основные вопросы темы:</h2>' ||
        '<ul>' ||
        '<li>Введение в тему занятия</li>' ||
        '<li>Ключевые понятия и определения</li>' ||
        '<li>Основные принципы и методы</li>' ||
        '<li>Практическое применение</li>' ||
        '<li>Контрольные вопросы для самопроверки</li>' ||
        '</ul>'
    FROM lessons l;

    -- ============================================================================
    -- 11. СОЗДАНИЕ ССЫЛОК
    -- ============================================================================
    
    INSERT INTO material_links (lesson_id, link_type, url, title, description)
    SELECT 
        l.id,
        CASE 
            WHEN l.lesson_type = 'group' THEN 'test_module'
            WHEN l.lesson_type = 'theory' THEN 'internal_library'
            ELSE 'external'
        END,
        CASE 
            WHEN l.lesson_type = 'group' THEN '/tests/' || l.id::text || '/start'
            WHEN l.lesson_type = 'theory' THEN '/library/disciplines/' || l.discipline_id::text
            ELSE 'https://encyclopedia.mil.ru/' || l.id::text
        END,
        CASE 
            WHEN l.lesson_type = 'group' THEN 'Тестирование по теме: ' || l.name
            WHEN l.lesson_type = 'theory' THEN 'Библиотека материалов: ' || l.name
            ELSE 'Дополнительные материалы: ' || l.name
        END,
        CASE 
            WHEN l.lesson_type = 'group' THEN 'Пройти тест для проверки знаний'
            WHEN l.lesson_type = 'theory' THEN 'Учебные пособия и методические материалы'
            ELSE 'Внешние источники и справочная информация'
        END
    FROM lessons l;

    -- ============================================================================
    -- 12. СОЗДАНИЕ ПРИКРЕПЛЕННЫХ ФАЙЛОВ
    -- ============================================================================
    
    INSERT INTO material_attachments (lesson_id, file_name, file_type, file_path, file_size, uploaded_by)
    SELECT 
        l.id,
        CASE l.lesson_type
            WHEN 'theory' THEN 'lecture_' || l.id::text || '.pdf'
            WHEN 'practics' THEN 'practical_workshop_' || l.id::text || '.pdf'
            ELSE 'group_materials_' || l.id::text || '.pdf'
        END as file_name,
        'application/pdf' as file_type,
        '/storage/lessons/' || l.id::text || '/materials.pdf',
        1048576 + (l.id % 5) * 512000,
        v_admin_id
    FROM lessons l
    UNION ALL
    SELECT 
        l.id,
        'presentation_' || l.id::text || '.pptx' as file_name,
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' as file_type,
        '/storage/lessons/' || l.id::text || '/presentation.pptx',
        2097152 + (l.id % 3) * 1024000,
        v_admin_id
    FROM lessons l
    WHERE l.lesson_type IN ('theory', 'practics');
    
END $$;

-- ============================================================================
-- 13. УДАЛЕНИЕ ВРЕМЕННОЙ ФУНКЦИИ (опционально)
-- ============================================================================

DROP FUNCTION IF EXISTS create_lessons_for_discipline(VARCHAR, BOOLEAN, INTEGER);

-- ============================================================================
-- ВЫВОД СТАТИСТИКИ ПО ЗАПОЛНЕННЫМ ДАННЫМ
-- ============================================================================

SELECT 'Направления подготовки', COUNT(*) from cources
UNION ALL
SELECT 'Связи направлений с дисциплинами', COUNT(*) FROM discipline_cources
UNION ALL
SELECT 'Дисциплины', COUNT(*) FROM disciplines
UNION ALL
SELECT 'Взводы', COUNT(*) FROM platoons
UNION ALL
SELECT 'Пользователи', COUNT(*) FROM users
UNION ALL
SELECT 'Администратор', COUNT(*) FROM users WHERE role = 'teacher'
UNION ALL
SELECT 'Студенты', COUNT(*) FROM users WHERE role = 'student'
UNION ALL
SELECT 'Занятия', COUNT(*) FROM lessons
UNION ALL
SELECT 'Текстовые материалы', COUNT(*) FROM material_texts
UNION ALL
SELECT 'Ссылки', COUNT(*) FROM material_links
UNION ALL
SELECT 'Прикрепленные файлы', COUNT(*) FROM material_attachments;

-- ============================================================================
-- ПРОВЕРКА СВЯЗЕЙ
-- ============================================================================

-- Проверка распределения студентов по взводам и направлениям
SELECT 
    c.name as direction,
    p.id as platoon,
    p.year_of_study,
    COUNT(u.id) as students
FROM cources c
JOIN platoons p ON c.id = p.cource_id
LEFT JOIN users u ON p.id = u.platoon_id AND u.role = 'student'
GROUP BY c.name, p.id, p.year_of_study
ORDER BY c.name, p.year_of_study, p.id;

-- Проверка дисциплин по направлениям
SELECT 
    c.name as direction,
    d.name as discipline,
    d.year_of_study
FROM cources c
JOIN discipline_cources dc ON c.id = dc.cource_id
JOIN disciplines d ON dc.discipline_id = d.id
ORDER BY c.name, d.year_of_study, d.name;

-- Проверка создателя всех занятий (должен быть admin)
SELECT DISTINCT 
    u.ldap_uid as created_by_user,
    COUNT(*) as lessons_count
FROM lessons l
JOIN users u ON l.created_by = u.id
GROUP BY u.ldap_uid;

-- ============================================================================
-- КОНЕЦ СКРИПТА ЗАПОЛНЕНИЯ ДАННЫМИ
-- ============================================================================