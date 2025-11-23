![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![React Query](https://img.shields.io/badge/React_Query-5.83.0-FF4154?logo=react-query)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.60.0-EC5990?logo=react-hook-form)
![React Router](https://img.shields.io/badge/React_Router_DOM-7.7.0-CA4245?logo=react-router)
![Recharts](https://img.shields.io/badge/Recharts-3.1.0-22B5BF?logo=recharts)
![SCSS](https://img.shields.io/badge/SCSS-1.89.2-CC6699?logo=sass)
![Ant Design](https://img.shields.io/badge/AntDesign-5.26.5-0170FE?logo=ant-design)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?logo=vite) 
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)
![Coverage](https://img.shields.io/badge/Coverage-65.65%25-brightgreen)

# Dev Tracker
Сервис для отслеживания прогресса в разработке — управление задачами, система здоровья и опыта, магазин и интеграция активности GitHub

🔗 [Демо](https://dev-tracker-client.vercel.app/)

---

## 📌 О проекте
Dev Tracker — это веб-приложение, которое помогает разработчикам:

- вести учёт активности через заметки, их статусы и сроки
- визуализировать прогресс (диаграммы, статистика)
- видеть ближайшие дедлайны
- наладить дисциплину посредством потери здоровья и опыта за просроченные дедлайны

---

## 🔨 Технологии

### Frontend
- React + TypeScript
- SCSS
- React Hook Form (для форм и валидации)
- React Query + Axios (для работы с API, кеширования)
- Recharts (для построения графиков)
- React Router DOM (для роутинга)
- Context API (для глобального состояния)
- Vite (для сборки)
- Vitest, React Testing library (для тестирования)

### Backend
- Node.js + Express
- TypeScript   
- JWT (авторизация)
- Multer (работа с файлами)
- GitHub API для учёта активности в GitHub

---

### Тестирование:
Проект покрыт тестами с использованием Vitest и React Testing Library. Покрываемость отображена в виде таблицы:
![Покрытие тестами](./screenshots/tests-coverage.png)

---

## 📦 Запуск и установка проекта
Клонируй репозиторий:
```
git clone https://github.com/LizKa2091/dev-tracker.git
cd dev-tracker
```
Для работы проекта необходимо создать файл `.env` в директории `frontend`, добавить `VITE_API_BASE_URL` (url сервера для запросов, рекомендуется http://localhost:5001):
```
VITE_API_BASE_URL="http://localhost:5001"
```
И создать файл `.env` в директории `backend`, добавить `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GITHUB_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `CLIENT_URL`
### Frontend
Установите пакеты: <br />
```
cd frontend
```
```
npm install
```
```
npm run dev
```

### Backend
Установите пакеты: <br />
```
cd backend
```
```
npm install
```
```
npx ts-node server.ts
```
