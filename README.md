# Mentor Portal

Портал для менторинга сотрудников с системой целей, задач и отзывов.

## Технологии

- **Backend**: .NET 8 Web API, Entity Framework Core, PostgreSQL, JWT Authentication
- **Frontend**: React 18, TypeScript, React Router, Axios
- **Database**: PostgreSQL 15+

## Требования

- .NET 8 SDK
- Node.js 18+ и npm
- PostgreSQL 15+

## Установка и запуск

### Backend

1. Перейдите в директорию backend:
```bash
cd backend/MentorPortal.API
```

2. Настройте строку подключения к базе данных в `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=mentorportal;Username=postgres;Password=postgres"
  }
}
```

3. Создайте базу данных PostgreSQL:
```bash
createdb mentorportal
```

4. Примените миграции:
```bash
dotnet ef database update
```

5. Запустите проект:
```bash
dotnet run
```

Backend будет доступен по адресу: `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` (опционально, если нужно изменить URL API):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Запустите проект:
```bash
npm start
```

Frontend будет доступен по адресу: `http://localhost:3000`

## Использование

1. Зарегистрируйте пользователя (ментор или сотрудник)
2. Для ментора: создайте связь ментор-сотрудник через базу данных или API
3. Сотрудник может создавать цели и задачи
4. Ментор может просматривать и корректировать цели сотрудников
5. Сотрудники могут оставлять отзывы друг на друга
6. Ментор видит отзывы на своих сотрудников

## Структура проекта

```
MentorPortal/
├── backend/
│   └── MentorPortal.API/
│       ├── Controllers/     # API контроллеры
│       ├── Models/          # Модели данных
│       ├── DTOs/            # Data Transfer Objects
│       ├── Services/        # Бизнес-логика
│       ├── Data/            # DbContext и конфигурация
│       └── Migrations/      # Миграции базы данных
└── frontend/
    └── src/
        ├── components/     # React компоненты
        ├── pages/          # Страницы приложения
        ├── services/       # API клиенты
        ├── context/        # React контексты
        └── types/          # TypeScript типы
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Цели
- `GET /api/goals` - Список целей
- `GET /api/goals/{id}` - Детали цели
- `POST /api/goals` - Создание цели
- `PUT /api/goals/{id}` - Обновление цели
- `DELETE /api/goals/{id}` - Удаление цели

### Задачи
- `GET /api/tasks/goals/{goalId}` - Список задач цели
- `POST /api/tasks/goals/{goalId}` - Создание задачи
- `PUT /api/tasks/{id}` - Обновление задачи
- `DELETE /api/tasks/{id}` - Удаление задачи

### Ментор
- `GET /api/mentors/employees` - Список сотрудников
- `GET /api/mentors/employees/{employeeId}/goals` - Цели сотрудника
- `PUT /api/mentors/goals/{id}/approve` - Одобрение цели
- `PUT /api/mentors/tasks/{id}/approve` - Одобрение задачи

### Отзывы
- `POST /api/reviews` - Создание отзыва
- `GET /api/reviews/mentor` - Отзывы для ментора
- `GET /api/reviews/my` - Мои отзывы

## Настройка связи ментор-сотрудник

Для создания связи между ментором и сотрудником можно использовать SQL:

```sql
INSERT INTO "MentorEmployees" ("MentorId", "EmployeeId", "CreatedAt")
VALUES (1, 2, NOW());
```

Где `MentorId` - ID ментора, `EmployeeId` - ID сотрудника.

## Примечания

- JWT токены действительны 7 дней
- Пароли хешируются с помощью BCrypt
- Все API endpoints требуют аутентификации (кроме регистрации и входа)
- Менторские endpoints требуют роль "Mentor"

