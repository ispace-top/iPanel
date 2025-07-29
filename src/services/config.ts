import fs from 'fs/promises';
import path from 'path';

// 定义配置对象的类型结构
interface Config {
    siteTitle?: string;
    navItems?: { name: string; url: string; icon: string }[];
    weather?: { cities: string[] };
    background?: { type: string; value: string };
    search?: {
        engines: { name: string; url: string; icon: string; custom?: boolean }[];
        defaultEngine: string;
    };
    passwordHash?: string;
    hasPassword?: boolean;
}

const configPath = path.join(process.cwd(), 'config.json');

const defaultConfig: Config = {
    siteTitle: 'NAS 控制台',
    navItems: [{ name: '我的路由器', url: 'http://192.168.1.1', icon: 'prebuilt:router' }],
    weather: { cities: ['北京'] },
    background: { type: 'bing', value: '' },
    search: {
        engines: [
            { 
                name: 'Google', 
                url: 'https://www.google.com/search?q=%s', 
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.57L19.04,4.5C17.02,2.62 14.71,1.73 12.19,1.73C6.7,1.73 2.13,6.2 2.13,12C2.13,17.8 6.7,22.27 12.19,22.27C17.85,22.27 21.64,18.33 21.64,12.27C21.64,11.77 21.52,11.42 21.35,11.1Z"/></svg>',
                custom: false
            },
            { 
                name: '百度', 
                url: 'https://www.baidu.com/s?wd=%s', 
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5,5.5C10.7,5.5 8.5,7.7 8.5,10.5C8.5,12.3 9.5,13.8 11,14.7V15.5C8.8,16.1 7.5,17.9 7.5,20H19.5C19.5,17.9 18.2,16.1 16,15.5V14.7C17.5,13.8 18.5,12.3 18.5,10.5C18.5,7.7 16.3,5.5 13.5,5.5M11.5,11.5C11.5,12.6 12.4,13.5 13.5,13.5C14.6,13.5 15.5,12.6 15.5,11.5C15.5,10.4 14.6,9.5 13.5,9.5C12.4,9.5 11.5,10.4 11.5,11.5M4.5,10.5C4.5,9.4 4.1,8.4 3.5,7.6L4.9,6.2C5.8,7.3 6.5,8.8 6.5,10.5C6.5,12.2 5.8,13.7 4.9,14.8L3.5,13.4C4.1,12.6 4.5,11.6 4.5,10.5M23.5,10.5C23.5,8.8 22.8,7.3 21.9,6.2L20.5,7.6C21.1,8.4 21.5,9.4 21.5,10.5C21.5,11.6 21.1,12.6 20.5,13.4L21.9,14.8C22.8,13.7 23.5,12.2 23.5,10.5Z"/></svg>',
                custom: false
            }
        ],
        defaultEngine: 'Google'
    }
};

export async function readConfig(): Promise<Config> {
    try {
        await fs.access(configPath);
        const fileContent = await fs.readFile(configPath, 'utf-8');
        let configData = JSON.parse(fileContent) as Config;
        
        // Merge with defaults to ensure all keys exist
        configData = { ...defaultConfig, ...configData };

        const baseEngines = defaultConfig.search?.engines || [];
        const customEngines = configData.search?.engines?.filter(e => e.custom) || [];
        
        const mergedSearchConfig = {
            ...defaultConfig.search,
            ...configData.search,
            engines: [...baseEngines, ...customEngines]
        };
        
        if (!mergedSearchConfig.engines.some(e => e.name === mergedSearchConfig.defaultEngine)) {
            mergedSearchConfig.defaultEngine = baseEngines[0]?.name || '';
        }

        configData.search = mergedSearchConfig as Config['search'];

        return configData;
    } catch (error) {
        console.log("配置文件不存在或读取失败，将创建默认配置。");
        await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
}

export async function saveConfig(data: Partial<Config>): Promise<void> {
    try {
        const fullConfig = { ...data };
        if (fullConfig.search?.engines) {
            fullConfig.search.engines = fullConfig.search.engines.filter(e => e.custom);
        }
        await fs.writeFile(configPath, JSON.stringify(fullConfig, null, 2));
    } catch (error) {
        console.error("保存配置文件失败:", error);
        throw error;
    }
}
