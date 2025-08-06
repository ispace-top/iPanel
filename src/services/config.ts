import fs from 'fs/promises';
import path from 'path';

// 定义配置对象的类型结构
interface Config {
    siteTitle?: string;
    nav?: { name: string; url: string; icon: string; requiresPassword?: boolean }[];
    weather?: { cities: string[]; apiKey?: string };
    background?: { type: string; value: string };
    search?: {
        engines: { name: string; url: string; icon: string; custom?: boolean }[];
        defaultEngine: string;
    };
    network?: {
        speedLimit?: {
            enabled: boolean;
            interface: string;
            value: string;
        };
    };
    passwordHash?: string;
    hasPassword?: boolean;
}

const configPath = path.join(process.cwd(), 'config.json');

const defaultConfig: Config = {
    siteTitle: 'NAS 控制台',
    nav: [{ name: 'Nas', url: 'http://192.168.1.1', icon: '<i data-lucide="edit"></i>', requiresPassword: false }],
    weather: { cities: ['北京'] },
    background: { type: 'bing', value: '' },
    search: {
        engines: [
            { 
                name: 'Google', 
                url: 'https://www.google.com/search?q={query}', 
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.57L19.04,4.5C17.02,2.62 14.71,1.73 12.19,1.73C6.7,1.73 2.13,6.2 2.13,12C2.13,17.8 6.7,22.27 12.19,22.27C17.85,22.27 21.64,18.33 21.64,12.27C21.64,11.77 21.52,11.42 21.35,11.1Z"/></svg>',
                custom: false
            },
            { 
                name: '百度', 
                url: 'https://www.baidu.com/s?wd={query}', 
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2932E1"><path d="M6.217 12.486c0-2.167-1.058-3.32-2.912-3.32-1.94 0-3.044 1.249-3.044 3.415 0 2.167 1.104 3.415 3.044 3.415 1.854 0 2.912-1.153 2.912-3.51zm7.247-5.991c-1.21 0-2.122.842-2.122 1.969 0 1.126.912 1.968 2.122 1.968s2.122-.842 2.122-1.968c0-1.127-.912-1.969-2.122-1.969zm6.352 4.827c-1.282 0-2.169 1.058-2.169 2.645 0 1.587.887 2.645 2.169 2.645 1.282 0 2.168-1.058 2.168-2.645 0-1.587-.886-2.645-2.168-2.645zM9.13 6.581c-1.706 0-2.962 1.249-2.962 2.912 0 1.663 1.256 2.912 2.962 2.912 1.706 0 2.962-1.249 2.962-2.912 0-1.663-1.256-2.912-2.962-2.912zm4.512 10.757c-2.645 0-4.47 1.153-4.47 2.645 0 1.492 1.825 2.645 4.47 2.645 2.645 0 4.47-1.153 4.47-2.645 0-1.492-1.825-2.645-4.47-2.645z"/></svg>',
                custom: false
            }
        ],
        defaultEngine: 'Google'
    },
    network: {
        speedLimit: {
            enabled: false,
            interface: 'eth0',
            value: ''
        }
    }
};

export const getConfig = readConfig;

export async function verifyPassword(password: string): Promise<boolean> {
    try {
        const config = await readConfig();
        // 如果没有设置密码，直接返回 true
        if (!config.passwordHash) {
            return true;
        }
        return config.passwordHash === password;
    } catch (error) {
        return false;
    }
}

export async function hasPassword(): Promise<boolean> {
    try {
        const config = await readConfig();
        // 确保 passwordHash 存在且不为空字符串
        return typeof config.passwordHash === 'string' && config.passwordHash.length > 0;
    } catch (error) {
        return false;
    }
}

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
