const dotenv = require('dotenv');
const path = require('path');

// --- 诊断并加载 .env 文件的最终方案 ---
// --- Final solution to diagnose and load the .env file ---
const envPath = path.resolve(__dirname, '../.env');
console.log(`[DEBUG] 正在尝试从以下路径加载 .env 文件: ${envPath}`);

const dotEnvResult = dotenv.config({ path: envPath });

if (dotEnvResult.error) {
    console.error('[DEBUG] 加载 .env 文件失败:', dotEnvResult.error);
} else {
    console.log('[DEBUG] .env 文件加载成功。');
    // 确认 HEWEATHER_KEY 是否真的被加载
    console.log(`[DEBUG] 是否找到 HEWEATHER_KEY: ${!!process.env.HEWEATHER_KEY}`);
}
// --- 诊断结束 ---

const express = require('express');
const { Request, Response, RequestHandler } = express;
const crypto = require('crypto');
const multer = require('multer');
const { readConfig, saveConfig } = require('./services/config');
const { getSystemInfo } = require('./services/systemInfo');
const { getWeather } = require('./services/weather');
const { getBingWallpaper } = require('./services/wallpaper');
const { applySpeedLimit, removeSpeedLimit, getSpeedLimitStatus } = require('./services/networkService');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
// 使用 __dirname 来确保静态文件路径的正确性
app.use(express.static(path.join(__dirname, '../public')));

// --- Hashing Utility ---
const hashPassword = (password: string): string => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// --- Multer Storage Configuration ---
const createStorage = (destination: string) => multer.diskStorage({
    destination: (req, file, cb) => {
        const destPath = path.join(__dirname, '../public', destination);
        require('fs').mkdirSync(destPath, { recursive: true });
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadIcon = multer({ storage: createStorage('uploads/icons') });
const uploadBackground = multer({ storage: createStorage('uploads/backgrounds') });

// --- API Endpoints ---
app.get('/api/system', async (req: Request, res: Response) => {
    try {
        const info = await getSystemInfo();
        res.json(info);
    } catch (error) {
        console.error("Error fetching system info:", error);
        res.status(500).json({ error: 'Failed to fetch system info' });
    }
});

app.get('/api/weather', async (req: Request, res: Response) => {
    const city = req.query.city as string;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }
    try {
        const weatherData = await getWeather(city);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch weather for ${city}` });
    }
});

app.get('/api/bing-wallpaper', async (req, res) => {
    try {
        const wallpaper = await getBingWallpaper();
        res.json(wallpaper);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Bing wallpaper' });
    }
});

app.get('/api/config', async (req, res) => {
    try {
        const config = await readConfig();
        res.json({
            ...config,
            passwordHash: undefined,
            hasPassword: !!config.passwordHash,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read config' });
    }
});

app.post('/api/verify-password', async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password required' });
    }
    try {
        const config = await readConfig();
        if (!config.passwordHash) {
            return res.json({ success: true });
        }
        const inputHash = hashPassword(password);
        if (inputHash === config.passwordHash) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/config', async (req, res) => {
    try {
        const newConfigData = req.body;
        const currentConfig = await readConfig();

        if (newConfigData.password) {
            if (typeof newConfigData.password === 'string' && newConfigData.password.length > 0) {
                 currentConfig.passwordHash = hashPassword(newConfigData.password);
            }
        }
        
        currentConfig.siteTitle = newConfigData.siteTitle;
        currentConfig.navItems = newConfigData.navItems;
        currentConfig.weather = newConfigData.weather;
        currentConfig.background = newConfigData.background;
        currentConfig.search = newConfigData.search;

        await saveConfig(currentConfig);
        res.status(200).json({ message: 'Config saved successfully' });
    } catch (error) {
        console.error("Error saving config:", error);
        res.status(500).json({ error: 'Failed to save config' });
    }
});

app.post('/api/upload/icon', uploadIcon.single('icon') as unknown as RequestHandler, (req: Request, res: Response) => {
    if (req.file) {
        res.json({ filePath: `/uploads/icons/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

app.post('/api/upload/background', uploadBackground.single('background') as unknown as RequestHandler, (req: Request, res: Response) => {
    if (req.file) {
        res.json({ filePath: `/uploads/backgrounds/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

// 网络限速 API 端点
// 查询限速状态
app.get('/api/network/speed-limit', async (req: Request, res: Response) => {
    const { interface: interfaceName } = req.query;

    if (!interfaceName) {
        return res.status(400).json({ success: false, message: '网络接口是必需的' });
    }

    try {
        const result = await getSpeedLimitStatus(interfaceName as string);
        res.json(result);
    } catch (error) {
        console.error('处理查询限速状态请求失败:', error);
        res.status(500).json({ success: false, message: `服务器错误: ${(error as Error).message}` });
    }
});

// 应用或移除限速
app.post('/api/network/speed-limit', async (req: Request, res: Response) => {
    const { interface: interfaceName, speed, action } = req.body;

    if (!interfaceName || !action) {
        return res.status(400).json({ success: false, message: '网络接口和操作类型是必需的' });
    }

    try {
        if (action === 'apply') {
            if (!speed) {
                return res.status(400).json({ success: false, message: '应用限速时必须提供限速值' });
            }
            const result = await applySpeedLimit(interfaceName, speed);
            res.json(result);
        } else if (action === 'remove') {
            const result = await removeSpeedLimit(interfaceName);
            res.json(result);
        } else {
            res.status(400).json({ success: false, message: '无效的操作类型，支持的操作: apply, remove' });
        }
    } catch (error) {
        console.error('处理网络限速请求失败:', error);
        res.status(500).json({ success: false, message: `服务器错误: ${(error as Error).message}` });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
