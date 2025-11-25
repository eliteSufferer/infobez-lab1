# Secure REST API with CI/CD Integration

Защищенное REST API приложение с интеграцией инструментов безопасности в CI/CD pipeline.

## Описание проекта

Базовое backend-приложение симулятора блога на Node.js + Express с реализацией базовых мер защиты от OWASP Top 10.

## API Endpoints

### 1. POST /auth/login
Аутентификация пользователя.

**Request:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### 2. GET /api/data
Получение списка постов (требуется аутентификация).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Data retrieved successfully",
  "user": "testuser",
  "data": [
    {
      "id": 1,
      "title": "First Post",
      "content": "Hello World"
    }
  ]
}
```

### 3. POST /api/posts
Создание нового поста (требуется аутентификация).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "New Post",
  "content": "Post content"
}
```

## Реализованные меры защиты

### 1. Защита от SQL-инъекций (SQLi)
- Используется in-memory хранилище без прямых SQL-запросов
- При работе с данными не используется конкатенация строк
- Все запросы к данным идут через безопасные методы поиска (Array.find)

### 2. Защита от XSS (Cross-Site Scripting)
- Функция `escapeHtml()` экранирует все специальные HTML символы
- Все пользовательские данные санитизируются перед отправкой и сохранением
- Защита применяется как на входе, так и на выходе данных

### 3. Защита от Broken Authentication
- **JWT токены**: После успешной аутентификации выдается JWT токен
- **Middleware проверки**: `authenticateToken` проверяет валидность токена на защищенных эндпоинтах
- **Хеширование паролей**: Используется bcrypt (10 раундов) для хеширования
- Пароли никогда не хранятся в открытом виде
- Токены имеют срок действия (24 часа)

### 4. Валидация входных данных
- Проверка наличия обязательных полей
- Возврат корректных HTTP статус-кодов

## CI/CD Pipeline

### SAST (Static Application Security Testing)
- **ESLint с плагином security**: Статический анализ кода на уязвимости

### SCA (Software Composition Analysis)
- **npm audit**: Проверка зависимостей на известные уязвимости
- **Snyk**: Дополнительное сканирование зависимостей

Pipeline запускается автоматически при:
- Push в ветки main/master
- Создании Pull Request

## Установка и запуск
```bash
# Установка зависимостей
npm install

# Запуск сервера
npm start

# Запуск в dev режиме
npm run dev
```

## Тестирование API

### Пример с curl:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

curl -X GET http://localhost:3000/api/data \
  -H "Authorization: Bearer TOKEN"

curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test Content"}'
```

## Скриншоты CI/CD

GitHub Actions
<br>
<img width="1239" height="611" alt="{C6BAB760-85F3-4EB3-AD5B-3E4FE04EC59E}" src="https://github.com/user-attachments/assets/76b85f2d-9a4d-41a8-a3f3-5ba8646d6954" />

Отчеты npm audit
<br>
<img width="579" height="160" alt="image" src="https://github.com/user-attachments/assets/29f3cedc-dd49-43e4-9631-2e84696b7a3e" />
<br>
<img width="330" height="473" alt="image" src="https://github.com/user-attachments/assets/6996a639-2f9a-4cd5-9f92-04efbe08cf37" />

Отчет snyk
<br>
<img width="896" height="544" alt="image" src="https://github.com/user-attachments/assets/780e3dc2-81d8-458c-9a24-2c197327b664" />

## Технологии

- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcrypt
- GitHub Actions

## Автор

Наземцев Сергей P3411
