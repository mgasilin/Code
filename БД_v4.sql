-- ============================================================================
-- СКРИПТ СОЗДАНИЯ БАЗЫ ДАННЫХ UMK (PostgreSQL 15+)
-- Учебно-методический комплекс Военного учебного центра
-- Версия: 2.0
-- Дата: 27 октября 2025
-- ============================================================================

-- ============================================================================
-- СОЗДАНИЕ БАЗЫ ДАННЫХ И ПОДКЛЮЧЕНИЕ
-- ============================================================================

-- Создание базы данных (раскомментировать при необходимости)
/*
CREATE DATABASE umk
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
*/

-- Подключение к базе данных
-- \c umk;

-- Удаляем схему со всеми объектами и создаем заново
DROP SCHEMA IF EXISTS dev_data CASCADE;
CREATE SCHEMA dev_data;

-- Устанавливаем как схему по умолчанию для сессии
SET search_path TO dev_data;

-- ============================================================================
-- СОЗДАНИЕ РАСШИРЕНИЙ
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Для полнотекстового поиска и индексов

-- ============================================================================
-- 1. ТАБЛИЦА: cources (направления подготовки)
-- Описание: Направления подготовки (специальности)
-- ============================================================================

DROP TABLE IF EXISTS cources CASCADE;

CREATE TABLE cources (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,    
    created_by  INTEGER, -- Внешний ключ добавим позже, после создания users
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active   BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE cources IS 'Направления подготовки (специальности)';
COMMENT ON COLUMN cources.name IS 'Название направления (например: "PBN")';
COMMENT ON COLUMN cources.description IS 'Подробное описание направления подготовки';
COMMENT ON COLUMN cources.created_by IS 'Пользователь, создавший запись направления';
COMMENT ON COLUMN cources.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN cources.updated_at IS 'Дата и время последнего обновления';
COMMENT ON COLUMN cources.is_active IS 'Флаг активности направления';

-- ============================================================================
-- 2. ТАБЛИЦА: platoons (взводы)
-- Описание: Группировка студентов по взводам/учебным группам
-- ============================================================================

DROP TABLE IF EXISTS platoons CASCADE;

CREATE TABLE platoons (
    id           VARCHAR(4) PRIMARY KEY,
    cource_id    INTEGER NOT NULL REFERENCES cources(id) ON DELETE RESTRICT,
    year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 5),
    description  TEXT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active    BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE platoons IS 'Взводы (учебные группы) студентов';
COMMENT ON COLUMN platoons.id IS 'Уникальный идентификатор взвода (например: "101А")';
COMMENT ON COLUMN platoons.cource_id IS 'Ссылка на направление подготовки (один взвод - одно направление)';
COMMENT ON COLUMN platoons.year_of_study IS 'Курс обучения (1-5)';
COMMENT ON COLUMN platoons.description IS 'Дополнительное описание взвода (специализация и т.д.)';
COMMENT ON COLUMN platoons.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN platoons.is_active IS 'Флаг активности (для мягкого удаления)';

-- Индексы для таблицы platoons
CREATE INDEX idx_platoons_cource ON platoons(cource_id);
CREATE INDEX idx_platoons_year ON platoons(year_of_study) WHERE is_active = TRUE;
CREATE INDEX idx_platoons_active ON platoons(is_active);

-- ============================================================================
-- 3. ТАБЛИЦА: users (пользователи)
-- Описание: Пользователи системы с гибридной аутентификацией
-- ============================================================================

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    ldap_uid      VARCHAR(255) UNIQUE,
    phone_number  VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    patronymic    VARCHAR(100),
    initials      VARCHAR(10) NOT NULL,
    email         VARCHAR(255) UNIQUE,
    platoon_id    VARCHAR(4) REFERENCES platoons(id) ON DELETE SET NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active     BOOLEAN DEFAULT TRUE,
    role          VARCHAR CHECK (role IN ('student', 'teacher')),
    
    -- Обеспечиваем хотя бы один способ аутентификации
    CONSTRAINT at_least_one_auth CHECK (
        phone_number IS NOT NULL OR ldap_uid IS NOT NULL
    )
);

COMMENT ON TABLE users IS 'Пользователи системы (студенты, преподаватели, администраторы)';
COMMENT ON COLUMN users.ldap_uid IS 'Уникальный идентификатор из LDAP/AD (может быть NULL при аутентификации по телефону)';
COMMENT ON COLUMN users.phone_number IS 'Номер телефона для входа (основной идентификатор)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt хеш пароля для аутентификации по телефону';
COMMENT ON COLUMN users.first_name IS 'Имя пользователя';
COMMENT ON COLUMN users.last_name IS 'Фамилия пользователя';
COMMENT ON COLUMN users.patronymic IS 'Отчество (для российских пользователей)';
COMMENT ON COLUMN users.email IS 'Email адрес';
COMMENT ON COLUMN users.platoon_id IS 'Ссылка на взвод (только для студентов)';
COMMENT ON COLUMN users.last_login_at IS 'Дата и время последнего входа в систему';
COMMENT ON COLUMN users.created_at IS 'Дата и время создания учетной записи';
COMMENT ON COLUMN users.updated_at IS 'Дата и время последнего обновления учетной записи';
COMMENT ON COLUMN users.is_active IS 'Флаг активности пользователя';
COMMENT ON COLUMN users.role IS 'Роль пользователя в системе: student или teacher';

-- Теперь добавляем внешний ключ в таблице cources
ALTER TABLE cources ADD CONSTRAINT cources_created_by_fk 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Индексы для таблицы users
CREATE UNIQUE INDEX idx_users_phone ON users(phone_number) WHERE phone_number IS NOT NULL;
CREATE UNIQUE INDEX idx_users_ldap ON users(ldap_uid) WHERE ldap_uid IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_platoon ON users(platoon_id) WHERE platoon_id IS NOT NULL;
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('russian', 
    coalesce(first_name, '') || ' ' || 
    coalesce(last_name, '') || ' ' || 
    coalesce(patronymic, '')));

-- ============================================================================
-- 4. ТАБЛИЦА: refresh_tokens (JWT refresh токены)
-- Описание: Хранение refresh токенов для продления сессии
-- ============================================================================

DROP TABLE IF EXISTS refresh_tokens;

CREATE TABLE refresh_tokens (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    -- Проверка корректности времени жизни токена
    CONSTRAINT valid_token_lifetime CHECK (expires_at > created_at)
);

COMMENT ON TABLE refresh_tokens IS 'JWT refresh токены для продления сессий пользователей';
COMMENT ON COLUMN refresh_tokens.user_id IS 'Ссылка на пользователя-владельца токена';
COMMENT ON COLUMN refresh_tokens.token IS 'Уникальный refresh токен (JWT)';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'Дата и время истечения срока действия токена';
COMMENT ON COLUMN refresh_tokens.created_at IS 'Дата и время создания токена';
COMMENT ON COLUMN refresh_tokens.revoked_at IS 'Дата и время отзыва токена (если был отозван досрочно)';

-- Индексы для таблицы refresh_tokens
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_expires ON refresh_tokens(expires_at);

-- ============================================================================
-- 5. ТАБЛИЦА: disciplines (дисциплины)
-- Описание: Учебные дисциплины в рамках направления подготовки
-- ============================================================================

DROP TABLE IF EXISTS disciplines;

CREATE TABLE disciplines (
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(255) NOT NULL,
    description           TEXT,
    year_of_study         INTEGER CHECK (year_of_study BETWEEN 1 AND 5),
    created_by            INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active             BOOLEAN DEFAULT TRUE
);


COMMENT ON TABLE disciplines IS 'Учебные дисциплины в рамках направлений подготовки';
COMMENT ON COLUMN disciplines.name IS 'Название дисциплины';
COMMENT ON COLUMN disciplines.description IS 'Описание дисциплины и её содержания';
COMMENT ON COLUMN disciplines.year_of_study IS 'Год обучения, на котором изучается дисциплина (1-5)';
COMMENT ON COLUMN disciplines.created_by IS 'Пользователь, создавший запись дисциплины';
COMMENT ON COLUMN disciplines.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN disciplines.updated_at IS 'Дата и время последнего обновления';
COMMENT ON COLUMN disciplines.is_active IS 'Флаг активности дисциплины';

-- Индексы для таблицы disciplines
CREATE INDEX idx_disciplines_year ON disciplines(year_of_study) WHERE year_of_study IS NOT NULL;
CREATE INDEX idx_disciplines_active ON disciplines(is_active);

DROP TABLE IF EXISTS discipline_cources;
create table discipline_cources (
	id serial primary key,
	cource_id INTEGER NOT NULL REFERENCES cources(id) ON DELETE CASCADE,
	discipline_id INTEGER NOT NULL references disciplines(id) ON DELETE CASCADE
);

COMMENT ON TABLE discipline_cources IS 'Связь между направлениями подготовки и их дисциплинами';
COMMENT ON column discipline_cources.id IS 'ID связи между направлениями подготовки и их дисциплинами';
COMMENT ON column discipline_cources.cource_id IS 'ID направления подготовки';
COMMENT ON column discipline_cources.discipline_id IS 'ID дисциплины';

-- ============================================================================
-- 6. ТАБЛИЦА: lessons (занятия)
-- Описание: Отдельные занятия в рамках дисциплины
-- ============================================================================

DROP TABLE IF EXISTS lessons;

CREATE TABLE lessons (
    id            SERIAL PRIMARY KEY,  
    discipline_id INTEGER NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    order_number  INTEGER NOT NULL,
    description   TEXT,
    lesson_type   VARCHAR(20) NOT NULL CHECK (lesson_type IN ('theory', 'practics', 'group')),
    created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active     BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE lessons IS 'Занятия (уроки) в рамках учебной дисциплины';
COMMENT ON COLUMN lessons.discipline_id IS 'Ссылка на родительскую дисциплину';
COMMENT ON COLUMN lessons.name IS 'Название занятия';
COMMENT ON COLUMN lessons.order_number IS 'Порядковый номер занятия в рамках дисциплины';
COMMENT ON COLUMN lessons.description IS 'Описание содержания и целей занятия';
COMMENT ON COLUMN lessons.lesson_type IS 'Тип занятия: theory (лекция), practics (практическое занятие/семинар), group (групповое занятие)';
COMMENT ON COLUMN lessons.created_by IS 'Пользователь, создавший занятие';
COMMENT ON COLUMN lessons.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN lessons.updated_at IS 'Дата и время последнего обновления';
COMMENT ON COLUMN lessons.is_active IS 'Флаг активности занятия';

-- Индексы для таблицы lessons
CREATE INDEX idx_lessons_discipline ON lessons(discipline_id);
CREATE INDEX idx_lessons_order ON lessons(discipline_id, order_number);
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_active ON lessons(is_active);


drop table if exists material_texts;

CREATE TABLE material_texts (
    id            SERIAL PRIMARY KEY,
    order_number  INTEGER DEFAULT 0,
    lesson_id     INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title         VARCHAR(255),
    material_text TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE material_texts IS 'Ссылки на дополнительные ресурсы в материалах';
COMMENT ON COLUMN material_texts.lesson_id IS 'Ссылка на материал, содержащий текст';
COMMENT ON COLUMN material_texts.title IS 'Заголовок ссылки для отображения';
COMMENT ON COLUMN material_texts.material_text IS 'Описание ресурса, на который ведет ссылка';
COMMENT ON COLUMN material_texts.created_at IS 'Дата и время создания ссылки';

-- Индексы для таблицы material_links
CREATE INDEX idx_texts_material ON material_texts(lesson_id);
CREATE INDEX idx_texts_order ON material_texts(lesson_id, order_number);


-- ============================================================================
-- 9. ТАБЛИЦА: material_attachments (вложенные файлы)
-- Описание: Файлы, прикрепленные к материалам
-- ============================================================================

DROP TABLE IF EXISTS material_attachments;

CREATE TABLE material_attachments (
    id          SERIAL PRIMARY KEY,
    lesson_id   INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    file_name   VARCHAR(255) NOT NULL,
    file_type   VARCHAR(100),
    file_path   VARCHAR(500) NOT NULL,
    file_size   BIGINT CHECK (file_size > 0),
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE material_attachments IS 'Файлы, прикрепленные к учебным материалам';
COMMENT ON COLUMN material_attachments.lesson_id IS 'Ссылка на занятие, к которому прикреплен файл';
COMMENT ON COLUMN material_attachments.file_name IS 'Оригинальное имя файла';
COMMENT ON COLUMN material_attachments.file_type IS 'MIME тип файла';
COMMENT ON COLUMN material_attachments.file_path IS 'Путь к файлу в файловой системе или объектном хранилище';
COMMENT ON COLUMN material_attachments.file_size IS 'Размер файла в байтах';
COMMENT ON COLUMN material_attachments.uploaded_by IS 'Пользователь, загрузивший файл';
COMMENT ON COLUMN material_attachments.uploaded_at IS 'Дата и время загрузки файла';

-- Индексы для таблицы material_attachments
CREATE INDEX idx_attachments_material ON material_attachments(lesson_id);
CREATE INDEX idx_attachments_type ON material_attachments(file_type);

-- ============================================================================
-- 10. ТАБЛИЦА: material_links (ссылки в материалах)
-- Описание: Ссылки на внешние ресурсы и библиотеку
-- ============================================================================

DROP TABLE IF EXISTS material_links;

CREATE TABLE material_links (
    id          SERIAL PRIMARY KEY,
    lesson_id   INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    link_type   VARCHAR(20) NOT NULL CHECK (link_type IN ('internal_library', 'external', 'test_module')),
    url         VARCHAR(1000) NOT NULL,
    title       VARCHAR(255),
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE material_links IS 'Ссылки на дополнительные ресурсы в материалах';
COMMENT ON COLUMN material_links.lesson_id IS 'Ссылка на материал, содержащий ссылку';
COMMENT ON COLUMN material_links.link_type IS 'Тип ссылки: internal_library (библиотека ВУЦ), external (внешний ресурс), test_module (модуль тестирования)';
COMMENT ON COLUMN material_links.url IS 'URL ссылки на ресурс';
COMMENT ON COLUMN material_links.title IS 'Заголовок ссылки для отображения';
COMMENT ON COLUMN material_links.description IS 'Описание ресурса, на который ведет ссылка';
COMMENT ON COLUMN material_links.created_at IS 'Дата и время создания ссылки';

-- Индексы для таблицы material_links
CREATE INDEX idx_links_material ON material_links(lesson_id);
CREATE INDEX idx_links_type ON material_links(link_type);



-- ============================================================================
-- ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ
-- ============================================================================

-- Функция для автоматического обновления поля updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применение триггера к таблицам с полем updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cources_updated_at BEFORE UPDATE ON cources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disciplines_updated_at BEFORE UPDATE ON disciplines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- ПРЕДСТАВЛЕНИЯ (VIEWS) ДЛЯ УДОБСТВА РАБОТЫ
-- ============================================================================

-- ============================================================================
-- ВЫВОД ИНФОРМАЦИИ О СОЗДАННОЙ СТРУКТУРЕ БАЗЫ ДАННЫХ
-- ============================================================================

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'dev_data'
ORDER BY tablename DESC;

-- ============================================================================
-- КОНЕЦ СКРИПТА СОЗДАНИЯ СХЕМЫ
-- ============================================================================