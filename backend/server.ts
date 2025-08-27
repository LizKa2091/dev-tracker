import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import axios from 'axios';

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
   credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());

interface User {
   email: string;
   password: string;
   name?: string;
   xp: number;
   profilePic?: string;
   difficulty: 'default' | 'hard';
   refreshToken?: string;
}

const users: Record<string, User> = {};
const blacklistedTokens = new Set<string>();

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
   throw new Error('JWT_SECRET or REFRESH_SECRET is not defined in .env');
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

   const accessToken = jwt.sign(
      { email: user.email, name: user.name },
      ACCESS_SECRET,
      { expiresIn: '15m' }
   );

   const refreshToken = jwt.sign(
      { email: user.email },
      REFRESH_SECRET!,
      { expiresIn: '7d' }
   );

   users[email].refreshToken = refreshToken;

   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
   });

   res.json({ token: accessToken, message: 'Успешный вход' });
});

app.post('/refresh', (req: Request, res: Response): void => {
   const tokenFromCookie = req.cookies?.refreshToken;

   if (!tokenFromCookie) {
      res.status(401).json({ message: 'Нет refreshToken' });
      return;
   }

   jwt.verify(tokenFromCookie, process.env.JWT_SECRET!, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded || typeof decoded === 'string') {
         res.status(403).json({ message: 'Неверный refreshToken' });
         return;
      }

      const { email } = decoded as JwtPayload;
      const user = users[email];

      if (!user || user.refreshToken !== tokenFromCookie) {
         res.status(403).json({ message: 'refreshToken не совпадает' });
         return;
      }

      const newRefresh = jwt.sign({ email }, REFRESH_SECRET, { expiresIn: '7d' });
      user.refreshToken = newRefresh;

      const newAccess = jwt.sign(
         { email: user.email, name: user.name },
         ACCESS_SECRET,
         { expiresIn: '15m' }
      );

      res.cookie('refreshToken', newRefresh, {
         httpOnly: true,
         sameSite: 'lax',
         secure: false,
         maxAge: 7 * 24 * 60 * 60 * 1000,
         path: '/',
      });

      res.json({ token: newAccess });
   });
});

app.post('/logout', authenticateToken, (req: Request, res: Response): void => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token) blacklistedTokens.add(token);

   const email = req.user?.email;
   if (email && users[email]) {
      users[email].refreshToken = undefined;
   }

   res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
   });

   res.json({ message: 'Успешный выход' });
});

const passwordResetTokens: Record<string, string> = {};

function generateResetToken() {
   return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

app.post('/forgot-password', (req: Request, res: Response) => {
   const { email } = req.body;

   if (!email || !users[email]) {
      res.status(400).json({ message: 'Пользователь с таким email не найден' });
      return;
   }

   const resetToken = generateResetToken();
   passwordResetTokens[resetToken] = email;

   res.json({ 
      message: 'Токен для сброса пароля создан',
      resetToken 
   });
});

app.post('/reset-password', (req: Request, res: Response) => {
   const { token, newPassword } = req.body;

   if (!token || !newPassword) {
      res.status(400).json({ message: 'Токен и новый пароль обязательны' });
      return;
   }

   const userEmail = passwordResetTokens[token];

   if (!userEmail || !users[userEmail]) {
      res.status(400).json({ message: 'Неверный или просроченный токен' });
      return;
   }

   users[userEmail].password = newPassword;

   delete passwordResetTokens[token];

   res.json({ message: 'Пароль успешно сброшен' });
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

interface IGitHubTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
};

app.get('/auth/github', (req: Request, res: Response) => {
   const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=read:user%20repo&redirect_uri=http://localhost:5001/auth/github/callback`;
   res.redirect(redirectUrl);
});

app.get('/auth/github/callback', async (req: Request, res: Response) => {
   const code = req.query.code as string;

   if (!code) {
      return res.status(400).json({ message: 'Code не передан' });
   }

   try {
      const tokenResponse = await axios.post<IGitHubTokenResponse>(
         'https://github.com/login/oauth/access_token',
         {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
         },
         { headers: { Accept: 'application/json' } }
      );

      res.json({ token: tokenResponse.data, message: 'Успешная авторизация' });

   } 
   catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Не удалось получить access_token' });
   }
});

app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req: Request, res: Response): void => {
   res.send('Сервер авторизации работает!');
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});