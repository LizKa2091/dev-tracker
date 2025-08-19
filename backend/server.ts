import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

declare global {
   namespace Express {
      interface Request {
         user?: JwtPayload;
      }
   }
}

app.use(cors({
   origin: 'http://localhost:5173',
}));

app.use(bodyParser.json());

interface User {
   email: string;
   password: string;
   name?: string;
   xp: number;
   profilePic?: string;
   difficulty: 'default' | 'hard';
}

const users: Record<string, User> = {};
const blacklistedTokens = new Set<string>();

if (!process.env.JWT_SECRET) {
   throw new Error('JWT_SECRET is not defined in .env');
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      res.status(401).json({ message: 'Токен не предоставлен' });
      return;
   }

   if (blacklistedTokens.has(token)) {
      res.status(403).json({ message: 'Токен недействителен' });
      return;
   }

   jwt.verify(token, process.env.JWT_SECRET!, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err || !decoded || typeof decoded === 'string') {
         res.status(403).json({ message: 'Неверный токен' });
         return;
      }

      req.user = decoded;
      next();
   });
};

app.post('/register', (req: Request, res: Response): void => {
   const { email, password, name } = req.body;

   if (!email || !password) {
      res.status(400).json({ message: 'Email и пароль обязательны' });
      return;
   }

   if (users[email]) {
      res.status(400).json({ message: 'Пользователь уже существует' });
      return;
   }

   users[email] = { email, password, name, xp: 0, difficulty: 'default' };
   res.status(201).json({ message: 'Пользователь зарегистрирован' });
});

app.post('/login', (req: Request, res: Response): void => {
   const { email, password } = req.body;

   const user = users[email];
   if (!user || user.password !== password) {
      res.status(401).json({ message: 'Неверный email или пароль' });
      return;
   }

   const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
   );

   res.json({ token });
});

app.post('/logout', authenticateToken, (req: Request, res: Response): void => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token) {
      blacklistedTokens.add(token);
   }

   res.json({ message: 'Успешный выход' });
});

function getLevelAndProgress(xp: number) {
   let level = 1;
   let xpForNextLevel = 100;
   let accumulatedXP = 0;

   while (xp >= xpForNextLevel) {
      xp -= xpForNextLevel;
      accumulatedXP += xpForNextLevel;
      level++;
      xpForNextLevel = level * 100;
   }

   return {
      level,
      currentXP: xp,
      xpForNextLevel
   };
}

app.get('/me', authenticateToken, (req: Request, res: Response): void => {
   const userEmail = req.user?.email;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   const user = users[userEmail];
   const levelData = getLevelAndProgress(user.xp);

   res.json({
      email: user.email,
      name: user.name,
      xp: user.xp,
      profilePic: user.profilePic ? `http://localhost:5001/${user.profilePic}` : null,
      difficulty: user.difficulty,
      ...levelData
   });
});

app.patch('/me', authenticateToken, (req: Request, res: Response): void => {
   const userEmail = req.user?.email;
   const { name, email } = req.body;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   if (email && email !== userEmail) {
      if (users[email]) {
         res.status(400).json({ message: 'Email уже используется' });
         return;
      }
      users[email] = { ...users[userEmail], email };
      delete users[userEmail];
   }

   if (name) {
      const targetEmail = email || userEmail;
      users[targetEmail].name = name;
   }

   const updatedEmail = email || userEmail;
   const updatedUser = users[updatedEmail];

   const newToken = jwt.sign(
      { email: updatedUser.email, name: updatedUser.name },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
   );

   const user = users[userEmail];

   res.json({
      message: 'Данные обновлены',
      token: newToken,
      user: {
         email: updatedUser.email,
         name: updatedUser.name,
         xp: updatedUser.xp,
         profilePic: user.profilePic ? `${req.protocol}://${req.get('host')}/${user.profilePic}` : null, 
         ...getLevelAndProgress(updatedUser.xp)
      }
   });
});

app.post('/me/change-password', authenticateToken, (req: Request, res: Response): void => {
   const userEmail = req.user?.email;
   const { oldPassword, newPassword } = req.body;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   const user = users[userEmail];

   if (!oldPassword || !newPassword) {
      res.status(400).json({ message: 'Старый и новый пароли обязательны' });
      return;
   }

   if (user.password !== oldPassword) {
      res.status(400).json({ message: 'Неверный старый пароль' });
      return;
   }

   users[userEmail].password = newPassword;

   res.json({ message: 'Пароль успешно изменён' });
});

app.patch('/me/difficulty', authenticateToken, (req: Request, res: Response): void => {
   const userEmail = req.user?.email;
   const { difficulty } = req.body;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   if (!['default', 'hard'].includes(difficulty)) {
      res.status(400).json({ message: 'Недопустимый режим сложности' });
      return;
   }

   users[userEmail].difficulty = difficulty as 'default' | 'hard';

   res.json({
      message: 'Режим сложности обновлён',
      difficulty: users[userEmail].difficulty
   });
});

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
   const allowedTypes = /jpeg|jpg|png/;
   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
   const mimetype = allowedTypes.test(file.mimetype);

   if (extname && mimetype) {
      cb(null, true);
   } 
   else {
      cb(new Error('Только изображения формата jpeg, jpg или png!'));
   }
};

const upload = multer({ storage, fileFilter });

app.post('/me/avatar', authenticateToken, upload.single('avatar'), (req: Request, res: Response): void => {
   const userEmail = req.user?.email;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   if (!req.file) {
      res.status(400).json({ message: 'Файл не загружен' });
      return;
   }

   const relativePath = `uploads/${req.file.filename}`;

   users[userEmail].profilePic = relativePath;

   res.json({ 
      message: 'Аватар обновлен',
      profilePic: `${req.protocol}://${req.get('host')}/${relativePath}`
   });
});

app.post('/xp/add', authenticateToken, (req: Request, res: Response): void => {
   const userEmail = req.user?.email;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   let xpToAdd: number = 0;

   switch (users[userEmail].difficulty) {
      case 'hard':
         xpToAdd = 12;
         break;
      default:
         xpToAdd = 20;
   }

   users[userEmail].xp += xpToAdd;

   res.json({
      message: `Добавлено ${xpToAdd} XP`,
      xp: users[userEmail].xp,
      ...getLevelAndProgress(users[userEmail].xp)
   });
});

app.post('/xp/remove', authenticateToken, (req: Request, res: Response): void => {
   const userEmail = req.user?.email;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   let xpToRemove = 0;
   switch (users[userEmail].difficulty) {
      case 'hard':
         xpToRemove = 25;
         break;
      default:
         xpToRemove = 15;
   }

   users[userEmail].xp = Math.max(0, users[userEmail].xp - xpToRemove);

   res.json({
      message: `Вычтено ${xpToRemove} XP`,
      xp: users[userEmail].xp,
      ...getLevelAndProgress(users[userEmail].xp)
   });
});

app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req: Request, res: Response): void => {
   res.send('Сервер авторизации работает!');
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});