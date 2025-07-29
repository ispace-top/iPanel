import dotenv from 'dotenv';
// Load environment variables from .env file at the very beginning
dotenv.config();

import express, { Request, Response, RequestHandler } from 'express';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { readConfig, saveConfig } from './services/config';
import { getSystemInfo } from './services/systemInfo';
import { getWeather } from './services/weather';
import { getBingWallpaper } from './services/wallpaper';

const app = express();
// Ensure PORT is a number to satisfy app.listen's type signature
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// --- Hashing Utility ---
const hashPassword = (password: string): string => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// --- Multer Storage Configuration ---
const createStorage = (destination: string) => multer.diskStorage({
    destination: (req, file, cb) => {
        const destPath = path.join(process.cwd(), 'public', destination);
        // This is a simple synchronous way to ensure the directory exists.
        // For more complex applications, using async fs operations from fs/promises would be better.
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

// GET /api/system
app.get('/api/system', async (req: Request, res: Response) => {
    try {
        const info = await getSystemInfo();
        res.json(info);
    } catch (error) {
        console.error("Error fetching system info:", error);
        res.status(500).json({ error: 'Failed to fetch system info' });
    }
});

// GET /api/weather
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

// GET /api/bing-wallpaper
app.get('/api/bing-wallpaper', async (req, res) => {
    try {
        const wallpaper = await getBingWallpaper();
        res.json(wallpaper);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Bing wallpaper' });
    }
});

// GET /api/config
// Reads the configuration and sends it to the client,
// omitting the password hash for security.
app.get('/api/config', async (req, res) => {
    try {
        const config = await readConfig();
        res.json({
            ...config,
            passwordHash: undefined, // Never send the hash to the client
            hasPassword: !!config.passwordHash,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read config' });
    }
});

// POST /api/verify-password
// Verifies a given password against the stored hash.
app.post('/api/verify-password', async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password required' });
    }
    try {
        const config = await readConfig();
        // If no password is set, any attempt is "successful" to allow setting one for the first time.
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

// POST /api/config
// Saves the new configuration from the client.
app.post('/api/config', async (req, res) => {
    try {
        const newConfigData = req.body;
        const currentConfig = await readConfig();

        // Handle password update
        if (newConfigData.password) {
            if (typeof newConfigData.password === 'string' && newConfigData.password.length > 0) {
                 currentConfig.passwordHash = hashPassword(newConfigData.password);
            }
        }
        
        // Update other configuration parts
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


// Using type assertion `as unknown as RequestHandler` to bypass the stubborn type conflict
// between the express versions used by multer and the main project.
app.post('/api/upload/icon', uploadIcon.single('icon') as unknown as RequestHandler, (req: Request, res: Response) => {
    if (req.file) {
        const filePath = `/uploads/icons/${req.file.filename}`;
        res.json({ filePath });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

app.post('/api/upload/background', uploadBackground.single('background') as unknown as RequestHandler, (req: Request, res: Response) => {
    if (req.file) {
        const filePath = `/uploads/backgrounds/${req.file.filename}`;
        res.json({ filePath });
    } else {
        res.status(400).send('No file uploaded.');
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
