import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

// add logic for levels based on xp
// TODO: add user profile pictures
// TODO: get user file from the form

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

   users[email] = { email, password, name, xp: 0 };
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
      ...levelData
   });
});

app.post('/xp/add', authenticateToken, (req: Request, res: Response): void => {
   const { amount } = req.body;
   const userEmail = req.user?.email;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Сумма для добавления должна быть положительным числом' });
      return;
   }

   users[userEmail].xp += amount;

   res.json({
      xp: users[userEmail].xp,
      ...getLevelAndProgress(users[userEmail].xp)
   });
});

app.post('/xp/remove', authenticateToken, (req: Request, res: Response): void => {
   const { amount } = req.body;
   const userEmail = req.user?.email;

   if (!userEmail || !users[userEmail]) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
   }

   if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Сумма для вычитания должна быть положительным числом' });
      return;
   }

   users[userEmail].xp = Math.max(0, users[userEmail].xp - amount);

   res.json({
      xp: users[userEmail].xp,
      ...getLevelAndProgress(users[userEmail].xp)
   });
});

app.get('/', (req: Request, res: Response): void => {
   res.send('Сервер авторизации работает!');
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});