import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import axios from 'axios'; // 新增 axios 依赖
import { getSystemInfo } from './services/systemInfo';
import { getWeather } from './services/weather';
import { getConfig, saveConfig } from './services/config';

const app = express();
const port = 3000;

// --- 中间件 ---
app.use(cors());
app.use(express.json());
// 将 'public' 目录设置为静态文件服务的根目录
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Multer 存储配置 ---

// 1. 图标存储配置
const iconStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      console.error('Failed to create icon upload directory:', error);
      // cb(error as Error, ''); 
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 2. 背景图片存储配置
const backgroundStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'backgrounds');
         try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            console.error('Failed to create background upload directory:', error);
            // cb(error as Error, '');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `bg-${Date.now()}-${file.originalname}`);
    },
});

const uploadIcon = multer({ storage: iconStorage });
const uploadBackground = multer({ storage: backgroundStorage });


// --- API Endpoints ---

// GET /api/config - 获取当前配置
app.get('/api/config', async (req, res) => {
  try {
    const config = await getConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ message: 'Failed to read configuration.' });
  }
});

// POST /api/config - 保存新配置
app.post('/api/config', async (req, res) => {
  try {
    await saveConfig(req.body);
    res.status(200).json({ message: 'Configuration saved successfully.' });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ message: 'Failed to save configuration.' });
  }
});

// GET /api/system - 获取实时系统信息
app.get('/api/system', async (req, res) => {
  try {
    const systemInfo = await getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ message: 'Failed to get system information.' });
  }
});

// GET /api/weather - 获取天气信息
app.get('/api/weather', async (req, res) => {
  const city = req.query.city as string;
  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }
  try {
    const weatherData = await getWeather(city);
    res.json(weatherData);
  } catch (error: any) {
    console.error(`Error fetching weather for ${city}:`, error);
    res.status(error.response?.status || 500).json({ message: `Failed to get weather for ${city}` });
  }
});

// NEW: GET /api/bing-wallpaper - 获取必应每日壁纸
app.get('/api/bing-wallpaper', async (req, res) => {
    try {
        const response = await axios.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
        if (response.data && response.data.images && response.data.images.length > 0) {
            const imageUrl = `https://www.bing.com${response.data.images[0].url}`;
            res.json({ url: imageUrl });
        } else {
            throw new Error('Bing API did not return any images.');
        }
    } catch (error) {
        console.error('Failed to fetch Bing wallpaper:', error);
        res.status(500).json({ message: 'Failed to fetch Bing wallpaper.' });
    }
});

// POST /api/upload/icon - 处理图标上传
app.post('/api/upload/icon', uploadIcon.single('icon') as unknown as RequestHandler, (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
});

// POST /api/upload/background - 处理背景图片上传
app.post('/api/upload/background', uploadBackground.single('background') as unknown as RequestHandler, (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const filePath = `/uploads/backgrounds/${req.file.filename}`;
    res.json({ filePath });
});


// --- 根路由和服务器启动 ---

// 将所有未匹配的 GET 请求重定向到 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
