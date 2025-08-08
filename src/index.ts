import express, { Request, Response } from 'express';
import cors from 'cors';
import { getConfig, saveConfig, verifyPassword, hasPassword } from './services/config';
import { getSystemInfo } from './services/systemInfo';
import { getWeather, getWeather7d } from './services/weather';
import { getBingWallpaper } from './services/wallpaper';
import { applySpeedLimit, removeSpeedLimit, getSpeedLimitStatus, startSmartQoS, stopSmartQoS, getSmartQoSStatus, getQoSTemplates, getRecommendedQoSConfig, detectNetworkPerformance, getNetworkInterfaces } from './services/networkService';

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 9257;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- FILE UPLOADS ---
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req: any, file: any, cb: any) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(UPLOADS_DIR));

// --- API Endpoints ---

// 为上传创建一个包装器，以提供更好的错误处理
const handleUpload = (uploadMiddleware: any) => (req: Request, res: Response) => {
    uploadMiddleware(req, res, function (err: any) {
        if (err) {
            // 捕获特定的权限错误
            if (err.code === 'EACCES') {
                return res.status(500).json({ error: '权限被拒绝。请检查服务器上的 "uploads" 目录是否有写入权限。' });
            }
            // 捕获其他 Multer 或未知错误
            return res.status(500).json({ error: `上传时发生错误: ${err.message}` });
        }

        if (!req.file) {
            return res.status(400).json({ error: '未上传文件。' });
        }
        
        res.json({ filePath: `/uploads/${req.file.filename}` });
    });
};

// 使用新的错误处理程序更新上传端点
app.post('/api/upload/icon', handleUpload(upload.single('icon')));
app.post('/api/upload/background', handleUpload(upload.single('background')));


// Config
app.get('/api/config', async (req: Request, res: Response) => {
    try {
        const config = await getConfig();
        const needsPassword = await hasPassword();
        res.json({ ...config, hasPassword: needsPassword });
    } catch (error) {
        res.status(500).json({ error: '读取配置失败' });
    }
});
app.post('/api/config', (req: Request, res: Response) => {
    try {
        saveConfig(req.body);
        res.status(200).json({ success: true });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

// Password Verification
app.post('/api/verify-password', async (req: Request, res: Response) => {
    const { password } = req.body;
    const isValid = await verifyPassword(password);
    if (isValid) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// System Info
app.get('/api/system', async (req: Request, res: Response) => {
    try {
        const data = await getSystemInfo();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get system info' });
    }
});

// Weather
app.get('/api/weather', async (req: Request, res: Response) => {
    const city = req.query.city as string;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }
    try {
        const data = await getWeather(city);
        res.json(data);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: `Failed to get weather data for ${city}: ${errorMessage}` });
    }
});

app.get('/api/weather/7d', async (req: Request, res: Response) => {
    const city = req.query.city as string;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }
    try {
        const data = await getWeather7d(city);
        res.json(data);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: `Failed to get 7-day weather data for ${city}: ${errorMessage}` });
    }
});

// Bing Wallpaper
app.get('/api/bing-wallpaper', async (req: Request, res: Response) => {
    try {
        const wallpaper = await getBingWallpaper();
        res.json(wallpaper);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get Bing wallpaper' });
    }
});

// Network Speed Limit
app.post('/api/network/speed-limit', async (req, res) => {
    const { interface: interfaceName, speed, action } = req.body;

    if (!interfaceName) {
        return res.status(400).json({ success: false, message: '网络接口名称是必需的' });
    }

    let result;
    if (action === 'apply' && speed) {
        result = await applySpeedLimit(interfaceName, speed);
    } else if (action === 'remove') {
        result = await removeSpeedLimit(interfaceName);
    } else {
        return res.status(400).json({ success: false, message: '无效的操作或缺少参数' });
    }

    res.json(result);
});

app.get('/api/network/speed-limit', async (req, res) => {
    const interfaceName = req.query.interface as string;
    if (!interfaceName) {
        return res.status(400).json({ success: false, message: '网络接口名称是必需的' });
    }
    const result = await getSpeedLimitStatus(interfaceName);
    res.json(result);
});

// 智能QoS API
app.post('/api/network/smart-qos/start', async (req, res) => {
    const config = req.body;
    if (!config.interface) {
        return res.status(400).json({ success: false, message: '网络接口名称是必需的' });
    }
    const result = await startSmartQoS(config);
    res.json(result);
});

app.post('/api/network/smart-qos/stop', async (req, res) => {
    const result = await stopSmartQoS();
    res.json(result);
});

app.get('/api/network/smart-qos/status', async (req, res) => {
    const result = await getSmartQoSStatus();
    res.json(result);
});

app.get('/api/network/qos-templates', async (req, res) => {
    const templates = getQoSTemplates();
    res.json(templates);
});

app.post('/api/network/qos-recommend', async (req, res) => {
    const networkInfo = req.body;
    if (!networkInfo.downloadSpeed || !networkInfo.uploadSpeed) {
        return res.status(400).json({ success: false, message: '需要提供下载和上传速度信息' });
    }
    const recommendation = getRecommendedQoSConfig(networkInfo);
    res.json(recommendation);
});

app.get('/api/network/interfaces', async (req, res) => {
    const interfaces = await getNetworkInterfaces();
    res.json(interfaces);
});

app.get('/api/network/performance', async (req, res) => {
    const interfaceName = req.query.interface as string;
    if (!interfaceName) {
        return res.status(400).json({ success: false, message: '网络接口名称是必需的' });
    }
    const performance = await detectNetworkPerformance(interfaceName);
    res.json(performance);
});


app.listen(port, '0.0.0.0', () => {
    console.log(`iPanel server listening at http://0.0.0.0:${port}`);
});
